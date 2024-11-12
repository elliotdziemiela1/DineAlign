import { Router } from 'express';
import User from "../models/user";
import mongoose from 'mongoose';

module.exports = function (router:Router) {
    const usersRoute = router.route("/users");
    const usersIdRoute = router.route("/users/:id");

    return router;
}