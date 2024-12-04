import exp from "constants";
import { useContext } from "react";
import { CalendarDetails, Privacy } from "../components/Calendar/Calendar";
import { DietDetails, EmptyUser, User } from "../components/Profile/Profile";
import axios from "axios";
import { AuthContext } from ".."

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

export async function followCalendar(calId: string, userEmail: string) {
    const user = await fetchUserByEmail(userEmail)
    if (user){
        user.followsDiet = {diet: calId,
            dietStarted: new Date(),
            daysCompleted: [],
            repeating: true}
        axios.put(`/api/users/${user._id}`,user);
    }
    
}


export async function fetchUserByEmail(email: string): Promise<User | null> {
    const users = await fetchAllUsers();
    const user = users?.find((item) => item.email === email)
    return user ? parseDates(user) : null;
}

export async function fetchUserByUsername(username: string): Promise<User | null> {
    const users = await fetchAllUsers();
    const user = users?.find((item) => item.username === username)
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
        "673f73cb54a474d56c8e35ae",
        "673f748ee1fad7f712907244"
    ]
}   

export async function fetchAllUsers(): Promise<User[] | null> {
    const response = await axios.get(`/api/users`)

    return response.data.data
}   

export async function fetchAllCalendars(): Promise<CalendarDetails[] | null> {
    const response = await axios.get("/api/calendars");

    return response.data.data
}
