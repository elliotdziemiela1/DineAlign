import React, { useState, useEffect } from 'react';
import style from './Calendar.module.scss'
import Day, { CurrentDay, DetailedDay } from './Day'
import { EmptyUser, User } from '../Profile/Profile';
import { DayOfTheWeek, getDayOfWeek, getEnumFromDate } from '../../utils/CalendarUtils';
import { fetchCalendar, fetchUserByEmail, fetchUserByID } from "../../services/fetchData";

export interface Meal {
    time: string;
    name: string;
    description?: string;
    link?: string;
}
export interface CalendarDay {
    descriptor: string;
    mealEntries: Meal[];
}

export enum Privacy {
    PRIVATE = 0,
    UNLISTED = 1,
    PUBLIC = 2,
}

export interface CalendarDetails {
    _id?: string;
    // A calendar cannot have zero days. Have at least one.
    // It is important that days MUST ALWAYS BE SORTED in ascending day number order
    // This should be verified by the backend when creating calendars.
    days: CalendarDay[]; 
    // Owner id
    owner: string; 
    // List of user ids that follow this calendar
    followedBy: string[]; 
    // List of tags used to describe the calendar
    tags: string[]; 
    // Privacy option
    privacy: Privacy;
    // List of ratings, leave as string for now, low priority feature
    ratings: string[];
    // Diet's name
    name: string;
    // Diet description
    description: string;
}

export interface DayDetails {
    isOpen: boolean;
    index: number;
}

// Shows the current day, given a start date
// This function expects the calendar and start date to be valid
export function showCurrentDay(startDate: Date, days: CalendarDay[]): React.JSX.Element {
    const currentTime = new Date();
    const baseDay = getEnumFromDate(startDate);
    const currentDayIndex = Math.floor(((Math.floor(currentTime.getTime() / 86400000) * 86400000) - (Math.floor(startDate.getTime() / 86400000) * 86400000)) / 86400000);
    const currentDay = days[currentDayIndex % days.length];
    console.log(baseDay, startDate, currentDayIndex, days.length);
    return (
        <CurrentDay index={currentDayIndex % days.length} dayOfWeek={getDayOfWeek((baseDay + currentDayIndex) % 7)} day={currentDay}/>
    );
}

/**
 * Component Calendar takes in a calendar id, which, on creation, fetches the corresponding calendar
 * from the backend
 * @param calendarId - String id of the calendar to fetch
 * @param user - User to personalize calendar with. This is not necessarily the owner.
 */
export default function Calendar({ user, calendarId }: {user: User | null, calendarId: string}) {
    const [dayDetails, setDayDetails] = useState<DayDetails>({isOpen: false, index: -1});
    const [calendar, setCalendar] = useState<CalendarDetails>({
        days: [],
        owner: '',
        followedBy: [],
        tags: [],
        privacy: Privacy.PRIVATE,
        ratings: [],
        name: '',
        description: '',
    });
    const [listOpen, setListOpen] = useState<Boolean>(false); // refers to the followers/ratings list
    const [owner, setOwner] = useState<User | null>(null);

    useEffect(() => {
        async function fetchCal() {
            if (calendarId) {
                let cal = await fetchCalendar(calendarId);
                if (cal !== null) {
                    if (cal.owner) {
                        let owner = await fetchUserByID(cal.owner);
                        if (owner !== null) {
                            console.log("Fetched owner:", owner);
                            setOwner(owner);
                        }
                    }
                    console.log("Fetched calendar:", cal);
                    setCalendar(cal);
                }
            }
        }
        fetchCal();
    }, [calendarId]);

    const startDate = user?.followsDiet?.dietStarted ?? new Date();
    const baseDay = !!(user?.followsDiet?.dietStarted) ? getEnumFromDate(user.followsDiet.dietStarted) : DayOfTheWeek.SUNDAY;
    const currentTime = new Date();
    const currentDayIndex = Math.floor(((Math.floor(currentTime.getTime() / 86400000) * 86400000) - (Math.floor(startDate.getTime() / 86400000) * 86400000)) / 86400000);

    return (
        <div className={style.calendar}>
            <h1>{calendar.name}</h1>
            <h2>Creator: {owner?.username ?? "No owner"}</h2>
            <div className={style.tags}>
                <h3>Tags: </h3>
                {calendar.tags?.map((t, idx) => <p key={idx}>{t}</p>)}
            </div>
            <div className={style.shortFollowersList}>
                <h3>Followers: </h3>
                {calendar.followedBy?.map((f, idx) => idx < 3 && <p>{f}</p>)}
                <button onClick={() => setListOpen(true)}>View all followers and ratings</button>
            </div>

            <div className={`${listOpen ? style.modalOpen : style.modalClosed}`}>
                <button onClick={() => setListOpen(false)}> x </button>
                <h2>Creator: {calendar.owner}</h2>
                <div className={style.followersList}>
                    <h3>Followers</h3>
                    {calendar.followedBy?.map((f, idx) => <p key={idx}>{f}</p>)} {/* Assuming f is a userID, replace with api call to get f's name and profile pic*/}
                </div>
                <div className={style.ratingsList}>
                    <h3>Ratings</h3>
                    {calendar.ratings?.map((r, idx) => <p key={idx}>{r}</p>)}  {/* Assuming r is a ratingID, replace with api call to get r's details (maybe starts and description)*/}
                </div>
            </div>
            <div className={style.calendarBody}>
                {calendar.days?.map((day, idx) => 
                    <Day index={idx} key={idx} dayOfWeek={getDayOfWeek((baseDay + idx) % 7)} highlighted={user !== null && currentDayIndex === idx}
                        descriptor={day.descriptor ?? "No overview provided."} openModal={setDayDetails}/>
                )}
            </div>
            <DetailedDay isOpen={dayDetails.isOpen} setDetails={setDayDetails}
                details={dayDetails.index >= 0 && dayDetails.index < calendar.days.length ? calendar.days[dayDetails.index] : undefined}/>
        </div>
    );
}