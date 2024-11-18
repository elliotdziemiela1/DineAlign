import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../..";
import styles from "./Home.module.scss";
import { EmptyUser, User } from "../Profile/Profile";
import { fetchCalendar, fetchUser, fetchPopularCalendarIDs } from "../../services/fetchData";
import { CalendarDetails, showCurrentDay } from "../Calendar/Calendar";
import Calendar from "../Calendar/Calendar";

export default function Home() {
    function showDiet() {
        if (userDetails.loading) {
            return (<div>Loading...</div>);
        } else if (!userDetails.loading && userDetails.user === null) {
            return (<div>Login to see your current diet!</div>);
        } else if (userDetails.user !== null && calendar === null) {
            return (<div>Choose a diet to start tracking!</div>)
        } else {
            return (
                <div>
                    {calendar !== null && showCurrentDay(user.followsDiet?.dietStarted as Date, calendar.days)}
                </div>
            )
        }
    }
    
    const userDetails = useContext(AuthContext);
    const [user, setUser] = useState<User>(EmptyUser);
    const [calendar, setCalendar] = useState<CalendarDetails | null>(null);
    const [popularCalendarIDs, setPopularCalendarIDs] = useState<string[] | null>([])
    console.log("Home:", userDetails);

    useEffect(() => {
        async function fetcher() {
            if (!!userDetails.user?.email) {
                const result = await fetchUser(userDetails.user?.email);
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
        async function fetchPopCalendars(){
            const popCalendarIDs = await fetchPopularCalendarIDs();
            setPopularCalendarIDs(popCalendarIDs);
        }
        fetchPopCalendars();
    }, [])

    return (
        <div className={styles.layout}>
            <div className={styles.notsure}>
                test
            </div>
            <div className={styles.feed}>
                <h2>Popular Diets:</h2>
                {popularCalendarIDs?.map((id, idx) => <div className={styles.popularCalDiv}>
                        <Calendar key={idx} user={null} calendarId={id}/>
                    </div>)}
            </div>
            <div className={styles.diet}>
                {showDiet()}
            </div>
        </div>
    );
}