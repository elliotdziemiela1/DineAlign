import { useParams } from 'react-router-dom';
import Calendar from './Calendar';
import styles from "./CalendarPage.module.scss"
import { useContext, useEffect, useState } from 'react';
import { EmptyUser, User } from '../Profile/Profile';
import { AuthContext } from '../..';
import { fetchUserByEmail } from '../../services/fetchData';


export default function CalendarPage() {
    const { id } = useParams();
    const [user, setUser] = useState<User>(EmptyUser);

    const userDetails = useContext(AuthContext);

    useEffect(()=>{
        async function fetcher() {
            if (userDetails.user?.email) {
                const u = await fetchUserByEmail(userDetails.user.email);
                if (u != null) {
                    console.log("Fetched user by email ", userDetails.user?.email, ":", u);
                    setUser(u);
                }
            }
        }
        fetcher();
    }, [userDetails]);

    return <div className={styles.container}>
        <Calendar personalizeUser={null} currentUser={user} calendarId={id ?? ""}/>
    </div>
}