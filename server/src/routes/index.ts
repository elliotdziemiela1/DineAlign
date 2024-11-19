/*
 * Connect all of your endpoints together here.
 */
import { Express, Router } from 'express';

module.exports = function (app:Express, router:Router) {
    app.use('/api/users', require('./users.ts')(router));
    app.use('/api/calendars',require('./calendars.ts')(router));
};
