import React, { useState, useEffect } from 'react';
import style from './Calendar.module.scss'
import Day, { CurrentDay, DetailedDay } from './Day'
import { User } from '../Profile/Profile';
import { DayOfTheWeek, getDayOfWeek, getEnumFromDate } from '../../utils/CalendarUtils';
import { fetchCalendar, fetchUserByEmail } from "../../services/fetchData";

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
    days: CalendarDay[];
    owner: string; //Stringified ObjectId presumably
    followedBy: string[];
    tags: string[];
    privacy: Privacy;
    ratings: string[]; //TODO - Implement ratings at a later date
}

export interface DayDetails {
    isOpen: boolean;
    index: number;
}

export function showCurrentDay(startDate: Date, days: CalendarDay[]): React.JSX.Element {
    if (!!startDate){
        startDate = new Date();
    }
    if (!days){
        return <p>Followed Calendar has no days</p>
    }
    const currentTime = new Date();
    const baseDay = getEnumFromDate(startDate);
    const currentDayIndex = Math.floor(((Math.floor(currentTime.getTime() / 86400000) * 86400000) - (Math.floor(startDate.getTime() / 86400000) * 86400000)) / 86400000);
    if (days.length < (currentDayIndex+1)){
        return <p>Current day doesn't have an entry in your followed calendar</p>
    }
    const currentDay = days[currentDayIndex];
    return (
        <CurrentDay index={currentDayIndex} dayOfWeek={getDayOfWeek((baseDay + currentDayIndex) % 7)} day={currentDay}/>
    )
}

/**
 * Component Calendar takes in a calendar id, which, on creation, fetches the corresponding calendar
 * from the backend
 * @param id - String id of the calendar
 */
export default function Calendar({ user, calendarId }: {user: User | null, calendarId: string | undefined}) {
    const [dayDetails, setDayDetails] = useState<DayDetails>({isOpen: false, index: -1});
    const [calendar, setCalendar] = useState<CalendarDetails>({
        //It is important that days MUST ALWAYS BE SORTED in ascending day number order
        days: [],
        owner: '',
        followedBy: [],
        tags: [],
        privacy: Privacy.PRIVATE,
        ratings: [],
    });
    const [listOpen, setListOpen] = useState<Boolean>(false) // refers to the followers/ratings list

    // const [creator, setCreator] = useState("John");
    // const [days, setDays] = useState<CalendarDay[]>([]);
    
    useEffect(()=>{
        async function fetchCal(){
            if (calendarId){
                let cal = await fetchCalendar(calendarId);
                if (cal !== null) {
                    setCalendar(cal);
                }
            }
        }
        fetchCal();
    }, []);

    const startDate = user?.followsDiet?.dietStarted ?? new Date();
    const baseDay = !!(user?.followsDiet?.dietStarted) ? getEnumFromDate(user.followsDiet.dietStarted) : DayOfTheWeek.SUNDAY;
    const currentTime = new Date();
    const currentDayIndex = Math.floor(((Math.floor(currentTime.getTime() / 86400000) * 86400000) - (Math.floor(startDate.getTime() / 86400000) * 86400000)) / 86400000);



    return (
        <div className={style.calendar}>
            <h2>Creator: {calendar.owner}</h2>
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