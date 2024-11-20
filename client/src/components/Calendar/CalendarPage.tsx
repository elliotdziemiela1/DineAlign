import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from './Calendar';


export default function CalendarPage() {
    const { id } = useParams();

    return <div><Calendar user={null} calendarId={id ?? ""}></Calendar></div>
}