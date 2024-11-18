import React, { useContext, useEffect, useState } from "react";
import style from "./Profile.module.css"
import defaultPfp from "./DefaultPFP.jpg"
import Calendar from "../Calendar/Calendar"
import { auth } from "../../services/auth";
import { Navigate } from "react-router-dom";
import { UserCredential } from "firebase/auth";
import { AuthContext } from "../..";
export interface User {
    name: string;
    bio?: string;
    age?: string;
    sex?: string;
    location?: string;
    followers: string[];
    following: string[];
    followsDiet?: DietDetails;
    completedDiets: number;
    dietsCreated: string[];
}

export interface DietDetails {
    diet: string;
    dietStarted: Date;
    daysCompleted: boolean[];
    repeating: boolean;
}

export const EmptyUser = {
    name: "",
    followers: [],
    following: [],
    completedDiets: 0,
    dietsCreated: [],
};

export default function Profile() {
    
    const bruh = useContext(AuthContext);
    console.log(bruh);
    
    //Replace with EmptyUser later
    const [user, setUser] = useState<User>({
        name: "John",
        followers: [],
        following: [],
        followsDiet: {
            diet: "test",
            dietStarted: new Date('11-16-2024'),
            daysCompleted: [],
            repeating: false,
        },
        completedDiets: 0,
        dietsCreated: [],
    });

    

    return (
        <div className={style.container}>
            {/* <!-- Cover Photo and Profile Picture --> */}
            <div className={style.coverPhoto}>
                <div className={style.profilePhoto}>
                    <img src={defaultPfp} alt="Profile"/>
                </div>
            </div>

            {/* <!-- User Info Section --> */}
            <div className={style.userInfo}>
                <h1>{user.name}</h1>
                <p>{user.bio ?? "No bio specified."}</p>
            </div>
            <div className={style.mainContent}>
                <div className={style.dietContent}>
                    {/* <!-- Diet Section --> */}
                    <div className={style.currentDietSection}>
                        <h2>{user.name}'s Current Diet</h2>
                        <div className={style.currentDiet}>
                            <Calendar user={user} calendarId={user.followsDiet?.diet ?? ''}/>
                        </div>
                    </div>

                    <div className={style.createdDietsSection}>
                        <h2>{user.name}'s Created Diets</h2>
                        <div className={style.createdDiets}>
                            <p>Insert created diet calendars here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}