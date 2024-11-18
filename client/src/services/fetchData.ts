import { CalendarDetails, Privacy } from "../components/Calendar/Calendar";
import { EmptyUser, User } from "../components/Profile/Profile";


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
        owner: '',
        followedBy: [],
        tags: [],
        privacy: Privacy.PRIVATE,
        ratings: [],
    };
}

export async function fetchUser(email: string): Promise<User | null> {
    //TODO
    return {
        name: "John",
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