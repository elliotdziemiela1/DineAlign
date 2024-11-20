import { CalendarDetails, Privacy } from "../components/Calendar/Calendar";
import { EmptyUser, User } from "../components/Profile/Profile";
import axios from "axios";

export async function fetchCalendar(id: string): Promise<CalendarDetails | null> {
    const response = await axios.get(`/api/calendars/${id}`);
    const data : CalendarDetails | null = response.data.data;
    return data;
}



export async function fetchUserByEmail(email: string): Promise<User | null> {
    const users = await fetchAllUsers();
    console.log("FETCH BY EMAIL")
    console.log(users)
    const user = users?.find((item) => item.email == email)
    console.log(user)
    return user ?? null;
    // return {
    //     username: "John",
    //     followers: [],
    //     following: [],
    //     followsDiet: {
    //         diet: "",
    //         dietStarted: new Date('11-16-2024'),
    //         daysCompleted: [],
    //         repeating: false,
    //     },
    //     completedDiets: 0,
    //     dietsCreated: [],
    // };
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
        "673cfc415f4cb88b22890a13",
        "673c0b8fe80af8f5bbd56417"
    ]
}   

export async function fetchAllUsers(): Promise<User[] | null> {
    const response = await axios.get(`/api/users`)

    return response.data.data
}   
