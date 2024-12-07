import axios from "axios";
import { CalendarDetails } from "../components/Calendar/Calendar";

export interface PostCalendarResult {
    success: boolean;
    data?: CalendarDetails;
    err?: string;
}
// Wrapper to post a calendar or update an existing calendar
// Will post a new calendar if calendarId is null, else will update
export async function createCalendar(calendar: CalendarDetails) {
    const calendarId = calendar?._id ?? null;
    const result: PostCalendarResult = {
        success: true,
    };

    try {
        console.log("Creating calendar with id:", calendarId);
        var response = (calendarId === null) ? await axios.post('/api/calendars', calendar) : await axios.put('/api/calendars/' + calendarId, calendar);
        console.log(response);
        if (response.status !== 200 && response.status !== 201) {
            result.success = false;
            result.err = response.statusText;
            return result;
        }
        result.data = response.data.data;
        return result;
    } catch (err: unknown) {
        console.log(err);
        result.success = false;
        result.err = err as string;
        return result;
    }
}