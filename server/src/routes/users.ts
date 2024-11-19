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

    router.post('/', async (req: Request, res: Response): Promise<void> => {
        try {
            const { username, password, email, bio, age, gender, location } = req.body;
    
            // Validate username, password, and email
            if (!username || !password || !email) {
                res.status(400).json({ message: "Username, password, and email are required", data: {} });
                return;
            }
    
            // Check for duplicates
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                res.status(400).json({ message: "Username or email already exists", data: existingUser });
                return;
            }
    
            // Create new user
            const newUser = new User({
                username,
                password,
                email,
                bio,
                age,
                gender,
                location,
            });
    
            // Save user to database
            const savedUser = await newUser.save();
            res.status(201).json({ message: `User "${username}" created`, data: savedUser });
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", data: err });
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
