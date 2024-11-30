import React, { useContext, useEffect, useState } from "react";
import style from "./Profile.module.css"
import defaultPfp from "./DefaultPFP.jpg"
import Calendar from "../Calendar/Calendar"
import { auth } from "../../services/auth";
import { Navigate, useParams } from "react-router-dom";
import { UserCredential } from "firebase/auth";
import { AuthContext } from "../..";
import { fetchUserByEmail, fetchUserByID } from "../../services/fetchData";

export interface User {
    _id?: string;
    username: string;
    bio?: string;
    age?: string;
    sex?: string;
    location?: string;
    followers: string[];
    following: string[];
    followsDiet?: DietDetails;
    completedDiets: number;
    dietsCreated: string[];
    email?: string;
}

export interface DietDetails {
    diet: string;
    dietStarted: Date;
    daysCompleted: boolean[];
    repeating: boolean;
}

export const EmptyUser = {
    username: "",
    followers: [],
    following: [],
    completedDiets: 0,
    dietsCreated: [],
};

export default function Profile() {
    
    const currentUser = useContext(AuthContext);
    const { id } = useParams();
    console.log("Profile's current user is:", currentUser, "or id:", id);

    //Replace with EmptyUser later
    const [user, setUser] = useState<User>(EmptyUser);

    useEffect(()=>{
        async function fetcher() {
            if (!!id) {
                const result = await fetchUserByID(id);
                if (result != null) {
                    setUser(result);
                }
            } else {
                if (currentUser.user?.email) {
                    const u = await fetchUserByEmail(currentUser.user.email);
                    if (u != null) {
                        console.log("Fetched user by email ", currentUser.user?.email, ":", u);
                        setUser(u);
                    }
                }
            }
        }
        fetcher();
    }, [id, currentUser]);

    
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
                <h1>{user.username}</h1>
                <p>{user.bio ?? "No bio specified."}</p>
            </div>
            <div className={style.mainContent}>
                <div className={style.dietContent}>
                    {/* <!-- Diet Section --> */}
                    <div className={style.currentDietSection}>
                        <h2>{user.username}'s Current Diet</h2>
                        <div className={style.currentDiet}>
                        {user.followsDiet?.diet ? (
                                <>
                                    <Calendar user={user} calendarId={user.followsDiet.diet} />
                                </>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    </div>

                    <div className={style.createdDietsSection}>
                        <h2>{user.username}'s Created Diets</h2>
                        <div className={style.createdDiets}>
                            {user.dietsCreated.map(d => {
                                return <div className={style.createdDiet}>
                                <Calendar user={null} calendarId={d} />
                                </div>})}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}