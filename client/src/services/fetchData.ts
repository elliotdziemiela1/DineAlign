import { CalendarDetails, Privacy } from "../components/Calendar/Calendar";
import { EmptyUser, User } from "../components/Profile/Profile";
import axios from "axios";

export async function fetchCalendar(id: string): Promise<CalendarDetails | null> {
    //TODO
    return {
        //It is important that days MUST ALWAYS BE SORTED in ascending day number order
        days: [ // dummy data
            {
                descriptor: "Day 1",
                mealEntries: [
                    {time:"time", name:"meal", link:"link"},
                    {time:"time", name:"meal", link:"link"}
                ]
            },
            {
                descriptor: "Day 2",
                mealEntries: [
                    {time:"time", name:"meal", link:"link"},
                    {time:"time", name:"meal", link:"link"}
                ]
            },
            {
                descriptor: "Day 3",
                mealEntries: [
                    {time:"time", name:"meal", link:"link"},
                    {time:"time", name:"meal", link:"link"}
                ]
            },
            {
                descriptor: "Day 4",
                mealEntries: [
                    {time:"time", name:"meal", link:"link"},
                    {time:"time", name:"meal", link:"link"}
                ]
            }
        ],
        owner: 'Test Owner',
        followedBy: ['Test Follower 1', 'test follower 2', 'test follower 3', 'test follower 4'],
        tags: ["test tag 1", "Test tag 2"],
        privacy: Privacy.PRIVATE,
        ratings: ["test rating 1", "test rating 2", "test rating 3"],
    };
}



export async function fetchUser(email: string): Promise<User | null> {
    //TODO
    return {
        username: "John",
        followers: [],
        following: [],
        followsDiet: {
            diet: "test",
            dietStarted: new Date('11-16-2024'),
            daysCompleted: [],
            repeating: false,
        },
        completedDiets: 0,
        dietsCreated: [],
    };
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
        "id_1",
        "id_2",
        "id_3"
    ]
}   

export async function fetchAllUsers(): Promise<User[] | null> {
    const response = await axios.get(`/api/users`)
    // const data = response.data.select()
    console.log(response.data.data)
    return response.data.data
}   
