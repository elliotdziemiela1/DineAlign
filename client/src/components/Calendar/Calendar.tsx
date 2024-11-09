import React, { useState, useEffect } from 'react';
import style from './calendar.module.css'
import Day from './Day'

interface Meal {
    time: string;
    name: string;
    link: string;
}
interface Day {
    descriptor?: string;
    mealEntries: Meal[];
}
interface CalendarProps {
    id?: number;
}

function Calendar({ id }: CalendarProps){
    const [creator, setCreator] = useState("John");
    const [days, setDays] = useState<Day[]>([]);

    useEffect(()=>{
        let dietDays = [ // dummy data
            {
                descriptor: "Day 1",
                mealEntries: [
                    {time:"time", name:"meal", link:"link"},
                    {time:"time", name:"meal", link:"link"}
                ]
            },
            {
                descriptor: "Day 2",
                mealEntries: [
                    {time:"time", name:"meal", link:"link"},
                    {time:"time", name:"meal", link:"link"}
                ]
            },
            {
                descriptor: "Day 3",
                mealEntries: [
                    {time:"time", name:"meal", link:"link"},
                    {time:"time", name:"meal", link:"link"}
                ]
            },
            {
                descriptor: "Day 4",
                mealEntries: [
                    {time:"time", name:"meal", link:"link"},
                    {time:"time", name:"meal", link:"link"}
                ]
            }
        ]; // make GET api call with "id" to get days
        setDays(dietDays);
    }, [])

    return (
        <div className={style.calendar}>
            <h2>Creator: {creator}</h2>
            <div className={style.calendarBody}>
                {days.map((day) => 
                    <Day descriptor={day.descriptor} mealEntries={day.mealEntries}/>
                )}
            </div>
        </div>
    );
}

export default Calendar