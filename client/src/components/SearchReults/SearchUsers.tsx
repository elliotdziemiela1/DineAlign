import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { User } from "../Profile/Profile";
// import { fetchAllUserIDs } from "../../services/fetchData";

export default function SearchUsers () {
    const { query } = useParams();
    const [allUsers, setAllUsers] = useState();

    useEffect(() => {
        async function fetchUsers () {

        }
    }, []);

    return (
    <div>
        <h1>{query}</h1>
    </div>
    )
}