import { Router, Request, Response } from 'express';
import User from "../models/user";
import mongoose, { isValidObjectId, mongo } from 'mongoose';

const usersRouter = (router:Router) => {
    router.get('/', async (req: Request, res: Response) =>{
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

    router.post('/', async (req:Request, res: Response) => {
        if (req.body && (req.body["username"] && req.body["password"] && req.body["email"])){
            try{
                const query = User.find();
                query.where({username: req.body["username"]});
                const result = await query.exec();
                if (result && result.length <= 0){
                    var addedUser = new User();
                    addedUser["username"] = req.body["username"];
                    addedUser["password"] = req.body["password"];
                    addedUser["email"] = req.body["email"];

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
                    res.status(400).json({message: "Username or email already exists", data: result});
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

    router.get('/:id',async (req: Request, res: Response) => {
        const id = req.params.id;

        // Validate ID
        if (!isValidObjectId(id)) {
            res.status(400).json({ message: "Invalid user ID" });
            return; // Stops execution of post
        }

        try {
            const user = await User.findById(id);
            if(!user) {
                res.status(404).json({ message: "User not found" });
                return; // Stops execution of post
            }
            res.status(200).json({ message: "Valid response", data: user });
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", data: err });
        }
    });

    router.delete('/:id', async (req: Request, res: Response) => {
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
};

export default usersRouter;
