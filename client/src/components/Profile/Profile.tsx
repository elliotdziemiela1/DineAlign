import React, { useState, useEffect } from "react";
import style from "./profile.module.css"
import defaultPfp from "./DefaultPFP.jpg"
import Calendar from "../Calendar/Calendar"

export interface User {
    name: string;
    bio?: string;
    age?: string;
    sex?: string;
    location?: string;
    followers: string[];
    following: string[];
    followsDiet: DietDetails | null;
    completedDiets: number;
    dietsCreated: string[];
}

export interface DietDetails {
    diet: string;
    dietStarted: Date;
    daysCompleted: boolean[];
    repeating: boolean;
}

function Profile() {
    const [name, setName] = useState('John');

    return (
        <div className={style.container}>
            {/* <!-- Cover Photo and Profile Picture --> */}
            <div className={style.coverPhoto}>
                <div className={style.profilePhoto}>
                    <img src={defaultPfp} alt="Profile Photo"/>
                </div>
            </div>

            {/* <!-- User Info Section --> */}
            <div className={style.userInfo}>
                <h1>{name}</h1>
                <p>Profile bio here</p>
            </div>
            <div className={style.mainContent}>
                <div className={style.dietContent}>
                    {/* <!-- Diet Section --> */}
                    <div className={style.currentDietSection}>
                        <h2>{name}'s Current Diet</h2>
                        <div className={style.currentDiet}>
                            <Calendar user={null} calendarId={''}/>
                        </div>
                    </div>

                    <div className={style.createdDietsSection}>
                        <h2>{name}'s Created Diets</h2>
                        <div className={style.createdDiets}>
                            <p>Insert created diet calendars here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;