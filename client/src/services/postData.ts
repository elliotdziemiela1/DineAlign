import axios from "axios";
import { CalendarDetails } from "../components/Calendar/Calendar";

// Wrapper to post a calendar or update an existing calendar
// Will post a new calendar if calendarId is null, else will update
export async function createCalendar(calendar: CalendarDetails, calendarId: string | null) {
    try {
        console.log("Creating calendar with id:", calendarId);
        var response = (calendarId === null) ? await axios.post('/api/calendars', calendar) : await axios.put('/api/calendars/' + calendarId, calendar);
        console.log(response);
    } catch (err: unknown) {
        console.log(err);
    }
}