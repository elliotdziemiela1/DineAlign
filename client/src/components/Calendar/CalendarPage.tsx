import { useParams } from 'react-router-dom';
import Calendar from './Calendar';
import styles from "./CalendarPage.module.scss"


export default function CalendarPage() {
    const { id } = useParams();

    return <div className={styles.container}><Calendar user={null} calendarId={id ?? ""}></Calendar></div>
}