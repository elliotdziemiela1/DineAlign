import React, { useContext, useEffect, useRef, useState } from "react";
import { CalendarDetails, DayDetails, DayWithIndex, EmptyCalendar, Meal } from "../Calendar/Calendar";
import style from "./Editor.module.scss";
import { fetchCalendar, fetchUserByEmail } from "../../services/fetchData";
import { AuthContext } from "../..";
import { EmptyUser, User } from "../Profile/Profile";
import { displayPrivacy, switchPrivacyOption } from "../../utils/CalendarUtils";

interface DayEditorProps {
    calendar: CalendarDetails;
    setCalendar: React.Dispatch<React.SetStateAction<CalendarDetails>>;
}

interface TagEditorProps {
    calendar: CalendarDetails;
    setCalendar: React.Dispatch<React.SetStateAction<CalendarDetails>>;
}

interface MealEditorProps {
    day: TentativeDay;
    setDay: React.Dispatch<React.SetStateAction<TentativeDay>>;
}

interface TentativeDay {
    open: boolean;
    index: number;
    description: string;
    mealEntries: Meal[];
}

// If null, creating a new calendar, else, updating an existing calendar id
// Assume the existing calendar id exists 
export default function Editor( {existingCalendarId}: {existingCalendarId: string | null}) {
    async function publishCalendar() {
        console.log("Current calendar:", calendar);
        if (calendar.days.length === 0) {
            console.log("Calendar is missing days!");
        }
    }
    const [calendar, setCalendar] = useState<CalendarDetails>(EmptyCalendar);
    const [user, setUser] = useState<User>(EmptyUser);

    const userDetails = useContext(AuthContext);

    useEffect(() => {
        async function fetcher() {
            var userResult: User | null = null;
            if (userDetails.user !== null) {
                userResult = await fetchUserByEmail(userDetails.user.email as string);
                if (userResult !== null) {
                    console.log("Fetched user.");
                    setUser(userResult);
                }
            }
            if (existingCalendarId !== null) {
                var calendarResult = await fetchCalendar(existingCalendarId as string);
                if (calendarResult !== null) {
                    console.log("Fetched existing calendar to edit");
                    if (userResult !== null) {
                        calendarResult.owner = userResult._id;
                    }
                    setCalendar(calendarResult);
                }
            } else {
                setCalendar(c => ({...c, owner: userResult?._id ?? ''}))
            }
            
        }
        fetcher();
    }, [existingCalendarId, userDetails.user]);

    return (
        <div className={style.calendar}>
            <h1>
                Name:&nbsp;
                <input value={calendar.name} onChange={(e) => setCalendar({...calendar, name: e.target.value})}/>
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
                <textarea value={calendar.description} onChange={(e) => setCalendar({...calendar, description: e.target.value})}></textarea>
            </div>
            <TagEditor calendar={calendar} setCalendar={setCalendar}/>
            <DayEditor calendar={calendar} setCalendar={setCalendar}/>
            
            <input type="button" onClick={() => publishCalendar()} value="Submit"/>
            
        </div>
    );
}

// This is analogous to the detailed day but will handle creating or editing a day
// TODO
function DayEditor({calendar, setCalendar}: DayEditorProps) {
    function modifyDays() {
        var newDays = [...calendar.days];
        // Push new day
        if (day.index === calendar.days.length) {
            newDays.push({descriptor: day.description, mealEntries: day.mealEntries});
        // Else modify the existing day
        } else {
            newDays[day.index].descriptor = day.description;
            newDays[day.index].mealEntries = day.mealEntries;
        }
        setCalendar({...calendar, days: newDays});
    }
    
    function updateEditor(index: number) {
        setDay({
            open: index >= 0,
            index: index,
            description: calendar.days[index]?.descriptor ?? '',
            mealEntries: calendar.days[index]?.mealEntries ?? [],
        });
    }
    const [day, setDay] = useState<TentativeDay>({open: false, index: -1, description: '', mealEntries: []});
    

    return (
        <>
            <div onClick={() => updateEditor(calendar.days.length)}>Add Day</div>
            <div className={style.calendarBody}>
                {calendar.days.length === 0 ? 'No days added. Use the button to add days to your diet!' : calendar.days?.map((day, idx) =>
                    <div className={style.day} key={idx} onClick={() => updateEditor(idx)}>
                        <p>{`Day ${idx + 1}`}</p>
                        <p>{day.descriptor}</p>
                    </div>
                )}
            </div>
            
            <div className={`${style.modal} ${day.open ? style.modalOpen : style.modalClosed}`}>
                <div className={style.exitModal} onClick={() => updateEditor(-1)}></div>
                <div>
                    <p>Day {day.index + 1}</p>
                    <p>Description:&nbsp;</p>
                    <input value={day.description} onChange={(e) => setDay({...day, description: e.target.value})}/>
                    <MealEditor day={day} setDay={setDay}/>
                </div>
                <input type="button" onClick={() => {setDay({...day, open: false}); modifyDays(); console.log("Day is:", day)}} value="Create day"/>
            </div>
        </>
        
    );
}

function TagEditor({calendar, setCalendar}: TagEditorProps) {
    const [modal, setModal] = useState(false);
    const [tagName, setTagName] = useState('');

    return (
        <>
            <div className={style.tags}>
                <h3>Tags: </h3>
                {calendar.tags?.map((t, idx) => <p key={idx}><span>X&nbsp;</span>{t}</p>)}
                <div onClick={() => setModal(true)}>Add Tag</div>
            </div>
            <div className={`${style.modal} ${modal ? style.modalOpen : style.modalClosed}`}>
                <div className={style.exitModal} onClick={() => setModal(false)}>X</div>
                <p>Tag name:&nbsp;</p>
                <input value={tagName} onChange={(e) => setTagName(e.target.value)}/>
                <input type="button" onClick={() => {setModal(false); setCalendar({...calendar, tags: [...calendar.tags, tagName]})}} value="Create Tag"/>
            </div>
        </>
        
    )
}

function MealEditor({day, setDay}: MealEditorProps) {
    function validateMeal() {
        if ((Object.hasOwn(meal, 'description') && meal.description === '') && (Object.hasOwn(meal, 'link') && meal.link === '')) {
            //TODO - change to error dialog
            console.log("Meal is not valid. Requires at least one source (description or link)");
        } else {
            setModal(false);
            var prunedMeal = {...meal};
            if (Object.hasOwn(prunedMeal, 'description') && prunedMeal.description === '') {
                delete prunedMeal.description;
            } else if (Object.hasOwn(prunedMeal, 'link') && prunedMeal.link === '') {
                delete prunedMeal.link;
            }

            setDay({...day, mealEntries: [...day.mealEntries, prunedMeal]})
        }
    }
    const [modal, setModal] = useState(false);
    const [meal, setMeal] = useState<Meal>({time: '', name: '', description: '', link: ''});

    return (
        <>
            <div onClick={() => setModal(true)}>Add meal entry</div>
            <p>Meals:&nbsp;</p>
            <div>
                {day.mealEntries.map((mealEntry, idx) => {
                    return (
                        <div key={idx}>
                            <h3>{mealEntry.name}</h3>
                            <p>{`Time of day: ${mealEntry.time}`}</p>
                            {!!mealEntry.description && <p>{mealEntry.description}</p>}
                            {!!mealEntry.link && <a href={mealEntry.link}>Source</a>}
                        </div>
                    )
                })}
            </div>
            
            <div className={`${style.modal} ${modal ? style.modalOpen : style.modalClosed}`}>
                <div className={style.exitModal} onClick={() => setModal(false)}>X</div>
                <p>Meal name:&nbsp;</p>
                <input value={meal.name} onChange={(e) => setMeal({...meal, name: e.target.value})}/>
                <p>Meal time:&nbsp;</p>
                <input value={meal.time} onChange={(e) => setMeal({...meal, time: e.target.value})}/>
                <p>Description:&nbsp;</p>
                <input value={meal.description} onChange={(e) => setMeal({...meal, description: e.target.value})}/>
                <p>Link:&nbsp;</p>
                <input value={meal.link} onChange={(e) => setMeal({...meal, link: e.target.value})}/>
                <input type="button" onClick={() => validateMeal()} value="Create Meal"/>
            </div>
        </>
        
    )
}