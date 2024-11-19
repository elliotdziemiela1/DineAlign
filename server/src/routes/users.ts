import { Router, Request, Response } from 'express';
import User from "../models/user";
import mongoose, { mongo } from 'mongoose';

module.exports = function (router:Router) {
    const usersRoute = router.route("/");
    const usersIdRoute = router.route("/:id");


    usersRoute.get(async (req: Request, res: Response) =>{
        const query = User.find({});
        try{
            // console.log("RESULT");
            const result = await query.exec();
            // console.log("EXECTURED");
            res.status(200).json({message: "Valid response", data:result});
        }
        catch (err) {
            res.status(500).json({message:"Internal server error - GET", data:err});
        }
    });

    usersRoute.post(async (req:Request, res: Response) => {
        if (req.body && (req.body["username"] && req.body["password"])){
            try{
                const query = User.find();
                query.where({username: req.body["username"]});
                const result = await query.exec();
                if (result && result.length <= 0){
                    var addedUser = new User();
                    addedUser["username"] = req.body["username"];
                    addedUser["password"] = req.body["password"];

                    if (req.body["bio"]) addedUser["bio"] = req.body["bio"];
                    if (req.body["age"]) addedUser["age"] = req.body["age"];
                    if (req.body["gender"]) addedUser["gender"] = req.body["gender"];
                    if (req.body["location"]) addedUser["location"] = req.body["location"];

                    try{
                        const result = await addedUser.save();
                        res.status(201).json({message: `User "${req.body["username"]}" created`, data:result});
                    }
                    catch (adderr){
                        res.status(500).json({message: "Internal server error - add user", data: adderr});
                    }
                }
                else if (!result){
                    res.status(500).json({message: "Internal Server Error - Find Duplicates - No Result", data: {}});
                }
                else {
                    res.status(400).json({message: "Username already exists", data: result});
                }

            }
            catch (err) {
                res.status(500).json({message: "Internal Server Error - Find Duplicates", data: err});
            }
        }
        else{
            res.status(400).json({message: "Missing request body", data: {}});
        }
    });

    usersIdRoute.get(async (req: Request, res: Response) => {
        const query = User.find();
        const id = req.params["id"];
        const u_id = new mongoose.Types.ObjectId(id);
        query.where({_id: u_id});
        try{
            const result = await query.exec();
            if (result && result.length > 0){
                res.status(200).json({message: "Valid response", data:result});
            }
            else{
                res.status(404).json({message: "User not found", data:{}})
            }
        }
        catch (err) {
            res.status(500).json({message:"Internal server error - GET", data:err});
        }
    });

    usersIdRoute.delete(async (req: Request, res: Response) => {
        const id = req.params["id"];

        // check if ID is valid
        if(!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid user ID", data: {} });
        }
        try {
            const result = await User.findByIdAndDelete(id);
            if (result) res.status(200).json({ mesage: "User deleted", data: result });
            else res.status(404).json({ message: "User not found", data:{} });
        } catch (err) {
            res.status(500).json({ message:"Internal server error - FIND / DELETE", data:err });
        }
    });

    return router;
}