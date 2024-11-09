import React, { useState, useEffect } from 'react';
import style from './calendar.module.css'
import Day from './Day'

interface Meal {
    time: string;
    name: string;
    link: string;
}
interface Day {
    mealEntries: Meal[];
}

function Calendar(){
    const [creator, setCreator] = useState("John");
    const [days, setDays] = useState<Day[]>([]);

    return (
        <div className={style.calendar}>
            <h2>Creator: {creator}</h2>
            <div className={style.calendarBody}>
                {days.map((day) => 
                    <Day mealEntries={day.mealEntries}/>
                )}
                <Day />
                <Day />
                <Day />
                <Day />
                <Day />
                <Day />
                <Day />
                <Day />
                <Day />
                <Day />
            </div>
        </div>
    );
}

export default Calendar