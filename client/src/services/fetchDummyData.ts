import { CalendarDetails, Privacy } from "../components/Calendar/Calendar";
import { DietDetails, User } from "../components/Profile/Profile";
import axios from "axios";

const dummyPopularCalendarIDs: string[] = [
    "c1",
    "c2"
]

const dummyCalendars: CalendarDetails[] = [
    {
        _id: "c1",
        days: 
        [
            {   descriptor: "Only Breakfast Day", 
                mealEntries: [
                    {time: "Morning", name: "Breakfast"}
                ]
            },
            {   descriptor: "Special Meals Day", 
                mealEntries: [
                    {time: "Morning", name: "Breakfast", description: "Yummy Omelette", link: "https://natashaskitchen.com/perfect-omelette-recipe/"},
                    {time: "Noon", name: "Snack", description: "Snack for Lunch"},
                    {time: "Evening", name: "Dinner", description: "Rich Lasagna", link: "https://natashaskitchen.com/perfect-omelette-recipe/"},
                ]
            }
        ],
        owner: "u1", 
        followedBy: ["u3","u4"], 
        tags: ["Random"], 
        privacy: Privacy.PUBLIC,
        ratings: [{thumb: 1, review: "Best Calendar Ever!", owner: "u3"}, 
            {thumb: 1, review: "Great for fasting, and it's delicious!", owner: "u4"}],
        name: "Fast and Feast",
        description: "Fast one day, then feast the next! Not your normal diet!"
    },
    {
        _id: "c2",
        days: [
            {
                descriptor: "Balanced Diet Day",
                mealEntries: [
                    {time: "Morning", name: "Breakfast", description: "Oatmeal with fruits", link: "https://natashaskitchen.com/perfect-omelette-recipe/"},
                    {time: "Noon", name: "Lunch", description: "Grilled Chicken Salad", link: "https://natashaskitchen.com/perfect-omelette-recipe/"},
                    {time: "Evening", name: "Dinner", description: "Quinoa and Vegetables", link: "https://natashaskitchen.com/perfect-omelette-recipe/"},
                ]
            },
            {
                descriptor: "High Protein Day",
                mealEntries: [
                    {time: "Morning", name: "Breakfast", description: "Scrambled Eggs with Spinach", link: "https://natashaskitchen.com/perfect-omelette-recipe/"},
                    {time: "Noon", name: "Lunch", description: "Grilled Salmon with Asparagus", link: "https://natashaskitchen.com/perfect-omelette-recipe/"},
                    {time: "Evening", name: "Dinner", description: "Chicken Breast with Broccoli", link: "https://natashaskitchen.com/perfect-omelette-recipe/"},
                ]
            },
            {
                descriptor: "Low Carb Day",
                mealEntries: [
                    {time: "Morning", name: "Breakfast", description: "Avocado and Eggs", link: "https://natashaskitchen.com/perfect-omelette-recipe/"},
                    {time: "Noon", name: "Lunch", description: "Zucchini Noodles with Pesto", link: "https://natashaskitchen.com/perfect-omelette-recipe/"},
                    {time: "Evening", name: "Dinner", description: "Cauliflower Fried Rice", link: "https://natashaskitchen.com/perfect-omelette-recipe/"},
                ]
            },
            {
                descriptor: "Vegetarian Day",
                mealEntries: [
                    {time: "Morning", name: "Breakfast", description: "Smoothie Bowl", link: "https://natashaskitchen.com/perfect-omelette-recipe/"},
                    {time: "Noon", name: "Lunch", description: "Quinoa Salad", link: "https://natashaskitchen.com/perfect-omelette-recipe/"},
                    {time: "Evening", name: "Dinner", description: "Vegetable Stir Fry", link: "https://natashaskitchen.com/perfect-omelette-recipe/"},
                ]
            },
            {descriptor: "Cheat Day",
                mealEntries: [
                    {time: "Morning", name: "Breakfast", description: "Pancakes with Syrup", link: "https://natashaskitchen.com/perfect-omelette-recipe/"},
                    {time: "Noon", name: "Lunch", description: "Cheeseburger and Fries", link: "https://natashaskitchen.com/perfect-omelette-recipe/"},
                    {time: "Evening", name: "Dinner", description: "Pizza Night", link: "https://natashaskitchen.com/perfect-omelette-recipe/"},
                ]
            }
        ],
        owner: "u2",
        followedBy: ["u1", "u3"],
        tags: ["Healthy", "Balanced"],
        privacy: Privacy.PUBLIC,
        ratings: [{thumb: 1, review: "Very nutritious!", owner: "u1"},
            {thumb: 1, review: "Loved the variety!", owner: "u3"}],
        name: "Balanced Meal Plan",
        description: "A meal plan that balances all food groups."
    }
];

export async function fetchCalendarDummy(id: string, userId?: string): Promise<CalendarDetails | null> {
    try {
        const data : CalendarDetails | null = dummyCalendars.find((cal) => cal._id === id) || null;
        if (data !== null && data.privacy === Privacy.PRIVATE && (!userId || data.owner !== userId)) {
            throw Error("Calendar is private.");
        }
        return data;
    } catch (err: unknown) {
        console.log("Error while fetching calendar:", err);
        return null;
    }
    
}

export async function followCalendarDummy(calId: string, user: User): Promise<DietDetails | undefined> {
    //const user = await fetchUserByEmail(userEmail);
    const calendar = await fetchCalendarDummy(calId);
    if (user && calendar) {
        // Remove self from old calendar's followedBy if exists
        if (user.followsDiet) {
            const oldCalendar = await fetchCalendarDummy(user.followsDiet.diet);
            if (oldCalendar) {
                oldCalendar.followedBy = oldCalendar.followedBy.filter((userId) => userId !== user._id);
                await axios.put("/api/calendars/" + oldCalendar._id, oldCalendar);
            }
        }

        user.followsDiet = {
            diet: calId,
            dietStarted: new Date(),
            daysCompleted: [],
            repeating: true
        };
        await axios.put(`/api/users/${user._id}`,user);
        
        calendar.followedBy = [...calendar.followedBy, user._id];
        await axios.put("/api/calendars/" + calId, calendar);
        return user.followsDiet;
    } else {
        return undefined;
    }
    
}


export async function fetchUserByEmailDummy(email: string): Promise<User | null> {
    const users = await fetchAllUsersDummy();
    const user = users?.find((item) => item.email === email)
    return user ? parseDates(user) : null;
}

export async function fetchUserByUsernameDummy(username: string): Promise<User | null> {
    const users = await fetchAllUsersDummy();
    const user = users?.find((item) => item.username === username)
    return user ? parseDates(user) : null;
}

export async function addRatingDummy(calId:string, review:string, thumb:number, ownerEmail:string) {
    let cal = await fetchCalendarDummy(calId);
    let owner = await fetchUserByEmailDummy(ownerEmail);
    if (cal?.ratings && owner?._id){
        let newRating = {
            thumb: thumb,
            review: review,
            owner: owner._id
        }
        cal.ratings.unshift(newRating)
        axios.put(`/api/calendars/${calId}`, cal)
    }
}

function parseDates(user: User): User {
    if (user?.followsDiet?.dietStarted) {
        user.followsDiet.dietStarted = new Date(user.followsDiet.dietStarted);
    }

    return user;
}

export async function fetchUserByIDDummy(id: string): Promise<User | null> {
    const response = await axios.get(`/api/users/${id}`);
    const user: User | null = response.data.data;

    return user ? parseDates(user) : null;
}

export async function fetchPopularCalendarIDsDummy(): Promise<string[] | null> {
    try {
        return dummyPopularCalendarIDs;
    } catch (err: unknown) {
        return null;
    }
}   

export async function fetchAllUsersDummy(): Promise<User[] | null> {
    const response = await axios.get(`/api/users`)

    return response.data.data
}   

export async function fetchAllCalendarsDummy(): Promise<CalendarDetails[] | null> {
    const response = await axios.get("/api/calendars");

    return response.data.data
}
