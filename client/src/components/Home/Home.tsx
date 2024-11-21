import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../..";
import styles from "./Home.module.scss";
import { EmptyUser, User } from "../Profile/Profile";
import { fetchCalendar, fetchUserByID, fetchPopularCalendarIDs, fetchUserByEmail } from "../../services/fetchData";
import { CalendarDay, CalendarDetails, showCurrentDay } from "../Calendar/Calendar";
import Calendar from "../Calendar/Calendar";

export enum MenuDisplay {
    FEED = 0,
    TRENDING = 1,
}

export default function Home() {
    function showDiet() {
        if (userDetails.loading) {
            return (<div>Loading...</div>);
        } else if (userDetails.user === null) {
            return (<div>Login to see your current diet!</div>);
        } else if (calendar === null) {
            return (<div>Choose a diet to start tracking!</div>)
        } else {
            console.log("Showing diet:", user.followsDiet?.dietStarted);
            return (
                <div>
                    {showCurrentDay(user.followsDiet?.dietStarted as Date, calendar.days)}
                </div>
            )
        }
    }

    function showFeed() {
        switch (display) {
            case MenuDisplay.FEED:
                var feed = [];
                
                return (
                    <>
                        {}
                    </>
                );
            case MenuDisplay.TRENDING:
                return (
                    <>
                        <h2>Popular Diets:</h2>
                        {popularCalendarIDs?.map((id, idx) => <div className={styles.popularCalDiv}>
                            <Calendar key={idx} user={null} calendarId={id}/>
                        </div>)}
                    </>
                    
                )
        }
    }
    
    const userDetails = useContext(AuthContext);
    const [user, setUser] = useState<User>(EmptyUser);
    const [calendar, setCalendar] = useState<CalendarDetails | null>(null);
    const [popularCalendarIDs, setPopularCalendarIDs] = useState<string[] | null>([]);
    const [feed, setFeed] = useState<CalendarDay[]>([]);
    const [display, setDisplay] = useState<MenuDisplay>(MenuDisplay.TRENDING);

    console.log("Home:", userDetails);

    useEffect(() => {
        async function fetcher() {
            console.log("Home fetcher")
            console.log(userDetails.user?.email)
            if (!!userDetails.user?.email) {
                const result = await fetchUserByEmail(userDetails.user?.email);
                console.log(result)
                if (result !== null && !!result.followsDiet) {
                    const calendarResult = await fetchCalendar(result.followsDiet.diet as string);
                    setCalendar(calendarResult);
                    setUser(result);
                }
            }
        };
        fetcher();
        
    }, [userDetails]);

    useEffect(() => {
        async function fetchPopCalendars() {
            const popCalendarIDs = await fetchPopularCalendarIDs();
            setPopularCalendarIDs(popCalendarIDs);
        }
        fetchPopCalendars();
    }, []);

    // useEffect(() => {
    //     async function fetchDayFromUser(user_id: string) {
    //         const result = await fetchUserByID(user_id);
    //         if (result !== null) {
    //             //If user exists, fetch calendar

    //         }
    //     }
    // })

    return (
        <div className={styles.layout}>
            {/* {<div className={styles.menu}>
                <div>Feed</div>
                <div>Trending Diets</div>
            </div>} */}
            <div className={styles.feed}>
                {showFeed()}
            </div>
            <div className={styles.diet}>
                <h2>Today's Menu</h2>
                {showDiet()}
            </div>
        </div>
    );
}