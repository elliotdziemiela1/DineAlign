import { Router } from 'express';
import Calendar from "../models/calendar";
import Meal from "../models/calendar";
import Day from "../models/calendar";
import mongoose from 'mongoose';

module.exports = function (router:Router) {
    const calendarRoute = router.route("/calendars");
    const calendarIdRoute = router.route("/calendars/:id");

    return router;
}