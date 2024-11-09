import React, { useState, useEffect } from 'react';
import style from './day.module.css'

interface Meal {
    time: string;
    name: string;
    link: string;
}
interface DayProps {
    descriptor?: string;
    mealEntries?: Meal[];
}

const Day = ({ descriptor, mealEntries } : DayProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    function toggleModal(){
        setModalOpen((open) => !open)
    }


    return (
        <div className={style.day}>
            <p>{descriptor}</p>
            <button className={style.modalButton} onClick={toggleModal}></button>
            <div className={`${style.modal} ${modalOpen ? style.modalOpen : style.modalClosed}`}>
                {mealEntries?.map((meal) => {
                    return (
                        <div className={style.meal}>
                            <p>Name: {meal.name}</p>
                            <p>Time: {meal.time}</p>
                            <p>Link: {meal.link}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Day