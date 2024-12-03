import React, { useContext, useEffect, useRef, useState } from "react";
import { CalendarDetails, DayDetails, EmptyCalendar } from "../Calendar/Calendar";
import style from "./Editor.module.scss";
import { fetchCalendar, fetchUserByEmail } from "../../services/fetchData";
import { AuthContext } from "../..";
import { EmptyUser, User } from "../Profile/Profile";
import Day, { DetailedDay } from "../Calendar/Day";
import { displayPrivacy, getDayOfWeek, switchPrivacyOption } from "../../utils/CalendarUtils";

interface DayEditorProps {
    details: DayDetails;
    setDetails: React.Dispatch<React.SetStateAction<DayDetails>>;
    calendar: CalendarDetails;
    setCalendar: React.Dispatch<React.SetStateAction<CalendarDetails>>;
}

// If null, creating a new calendar, else, updating an existing calendar id
// Assume the existing calendar id exists 
export default function Editor( {existingCalendarId}: {existingCalendarId: string | null}) {
    const [calendar, setCalendar] = useState<CalendarDetails>(EmptyCalendar);
    const [user, setUser] = useState<User>(EmptyUser);
    const [dayEditor, setDayEditor] = useState<DayDetails>({isOpen: false, index: -1});
    const nameRef = useRef("None");

    const userDetails = useContext(AuthContext);

    useEffect(() => {
        async function fetcher() {
            const result = await fetchCalendar(existingCalendarId as string);
            if (result !== null) {
                console.log("Fetched existing calendar to edit");
                setCalendar(result);
            }
        }
        if (existingCalendarId !== null) {
            fetcher();
        }
    }, [existingCalendarId]);

    useEffect(() => {
        async function fetcher() {
            if (userDetails.user !== null) {
                const result = await fetchUserByEmail(userDetails.user.email as string);
                if (result !== null) {
                    console.log("Fetched user.");
                    setUser(result);
                }
            }
            
        }
        fetcher();
    }, [userDetails.user]);

    return (
        <div className={style.calendar}>
            <h1>
                Name:&nbsp;
                <input value={calendar.name} onChange={(e) => setCalendar({...calendar, name: e.target.innerText})}/>
            </h1>
            <h2>Creator: {user.username ?? "Loading..."}</h2>
            <div>
                Privacy:&nbsp;
                <span onClick={() => setCalendar({...calendar, privacy: switchPrivacyOption(calendar.privacy)})}>
                    {displayPrivacy(calendar.privacy)}
                </span>
            </div>
            <div>
                Description:
                <textarea></textarea>
            </div>
            <div className={style.tags}>
                <h3>Tags: </h3>
                {calendar.tags?.map((t, idx) => <p key={idx}>{t}</p>)}
            </div>
            <div className={style.calendarBody}>
                {calendar.days?.map((day, idx) =>
                    <>
                        <div className={style.day} key={idx} onClick={() => setDayEditor({isOpen: true, index: idx})}>
                            <p>{`Day ${idx + 1}`}</p>
                            <p>{day.descriptor}</p>
                        </div>
                    </>
                )}
            </div>
            <input type="button" onClick={() => console.log("Current calendar:", calendar)} value="Submit"/>
            <DayEditor details={dayEditor} setDetails={setDayEditor} calendar={calendar} setCalendar={setCalendar}/>
        </div>
    );
}

// This is analogous to the detailed day but will handle creating or editing a day
// TODO
function DayEditor({details, setDetails, calendar, setCalendar}: DayEditorProps) {
    return (
        <div className={`${style.modal} ${details.isOpen ? style.modalOpen : style.modalClosed}`}>
            <div className={style.exitModal} onClick={() => setDetails({isOpen: false, index: -1})}></div>
            <div className={style.dayContent}>
                {}
            </div>
        </div>
    );
}