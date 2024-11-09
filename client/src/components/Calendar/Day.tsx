import React from 'react';
import style from './day.module.css'

interface Meal {
    time: string;
    name: string;
    link: string;
}
interface DayProps {
    mealEntries?: Meal[];
}

const Day = ({ mealEntries } : DayProps) => {

    return (
        <div className={style.day}>
            <p>Hello World</p>
        </div>
    );
}

export default Day