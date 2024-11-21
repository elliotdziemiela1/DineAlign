import { CalendarDetails, Privacy } from "../components/Calendar/Calendar";
import { EmptyUser, User } from "../components/Profile/Profile";
import axios from "axios";

export async function fetchCalendar(id: string): Promise<CalendarDetails | null> {
    try {
        const response = await axios.get(`/api/calendars/${id}`);
        const data : CalendarDetails | null = response.data.data;
        console.log("Trying to fetch calendar:", data);
        return data;
    } catch (err: unknown) {
        console.log("Error while fetching calendar:", err);
        return null;
    }
    
}



export async function fetchUserByEmail(email: string): Promise<User | null> {
    const users = await fetchAllUsers();
    const user = users?.find((item) => item.email === email)
    return user ? parseDates(user) : null;
}


function parseDates(user: User): User {
    if (user?.followsDiet?.dietStarted) {
        user.followsDiet.dietStarted = new Date(user.followsDiet.dietStarted);
    }

    return user;
}

export async function fetchUserByID(id: string): Promise<User | null> {
    const response = await axios.get(`/api/users/${id}`);
    const user: User | null = response.data.data;

    return user ? parseDates(user) : null;
}

export async function fetchPopularCalendarIDs(): Promise<string[] | null> {
    return [
        "673f7047db6aa09d53267c9d"
    ]
}   

export async function fetchAllUsers(): Promise<User[] | null> {
    const response = await axios.get(`/api/users`)

    return response.data.data
}   
