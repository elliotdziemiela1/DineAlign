import { useParams, Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { User } from "../Profile/Profile";
import { fetchAllCalendars, fetchAllUsers } from "../../services/fetchData";
import styles from "./SearchDiets.module.scss"
import { CalendarDetails } from "../Calendar/Calendar";


export default function SearchDiets () {
    const { query } = useParams();
    const [allDiets, setAllDiets] = useState<CalendarDetails []>([]);

    useEffect(() => {
        async function fetcher () {
            const result = await fetchAllCalendars();
            if (result != null){
                setAllDiets(result);
            }
        }
        fetcher();
    }, []);

    var sortedDiets;
    if (!!query){
        sortedDiets = allDiets.filter((diet) => diet.name.toLowerCase().includes(query.toLowerCase()))
    }

    return (
    <div className={styles.container}>
        <h1>Search Query: {query}</h1>
        <ul>
            {sortedDiets?.map((d, idx) => 
            <li key={idx}>
                <div>
                    <h3>{d.name}</h3>
                    <Link to={`/calendar/${d._id}`}>View Calendar</Link>
                </div>
            </li>)}
        </ul>
        
    </div>
    )
}