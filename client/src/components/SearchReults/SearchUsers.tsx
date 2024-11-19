import { useParams, Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { User } from "../Profile/Profile";
import { fetchAllUsers } from "../../services/fetchData";
import styles from "./SearchUsers.module.scss"


export default function SearchUsers () {
    const { query } = useParams();
    const [allUsers, setAllUsers] = useState<User []>([]);

    useEffect(() => {
        async function fetcher () {
            const result = await fetchAllUsers();
            if (result != null){
                setAllUsers(result);
            }
        }
        fetcher();
    }, []);

    const sortedUsers = allUsers.filter((user) => user.username.toLowerCase().includes(query.toLowerCase()))

    return (
    <div className={styles.container}>
        <h1>Search Query: {query}</h1>
        <ul>
            {sortedUsers.map((u, idx) => 
            <li key={idx}>
                <div>
                    <h3>{u.username}</h3>
                    <Link to={`/profile/${u._id}`}>View Profile</Link>
                </div>
            </li>)}
        </ul>
        
    </div>
    )
}