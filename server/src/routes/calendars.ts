import { Router, Request, Response } from 'express';
import { Calendar, Day, Meal } from "../models/calendar";
import mongoose from 'mongoose';
import { isValidObjectId, Types} from 'mongoose';

const calendarsRouter = (router:Router) => {
    const validPrivacy = ["unlisted", "private", "public"];

    router.get('/', async (req: Request, res: Response) =>{
        const query = Calendar.find();
        try{
            const result = await query.exec();
            res.status(200).json({message: "Valid response", data:result});
        }
        catch (err) {
            res.status(500).json({message:"Internal server error - GET", data:err});
        }
    });

    router.post('/', async (req:Request, res:Response) => {
        try {
            // Validate req.body
            if(!req.body || !req.body["ownedBy"]) {
            res.status(400).json({ message: "Invalid request body / 'ownedBy' is required", data: {} });
        }
        
        // Validate and convert 'ownedBy' to ObjectId
        const ownedBy = req.body["ownedBy"];
        if (!isValidObjectId(ownedBy)) {
            res.status(400).json({
                message: "'ownedBy' must be a valid ObjectId.",
                data: {},
            });
            return; // Stops execution of post
        }
        
        const owner_id = new Types.ObjectId(ownedBy);
        
        // Validate privacy
        const privacy = req.body["privacy"];
        if(privacy && !validPrivacy.includes(privacy)) {
            res.status(400).json({ message: "Invalid privacy option", data: {} });
            return; // Stops execution of post
        }
        
        var addedCalendar = new Calendar({
            ownedBy: owner_id,
            privacy: privacy || undefined,
            dayOffset: req.body["dayOffset"] || undefined,
            name: req.body["name"]
        });
        
        const result = await addedCalendar.save();
        res.status(201).json({ message: "Calendar created successfully", data: result});
        } catch(err) {
            res.status(500).json({ message: "Internal Service Error", data: err });
        }
    });
    
    router.get('/:id', async (req: Request, res:Response) => {
        const id = req.params.id;

        // Validate ID
        if (!isValidObjectId(id)) {
            res.status(400).json({ message: "Invalid calendar ID" });
            return; // Stops execution of post
        }
    
        try {
            const calendar = await Calendar.findById(id);
            if (!calendar) {
                res.status(404).json({ message: "Calendar not found" });
                return; // Stops execution of post
            }
            res.status(200).json({ message: "Valid response", data: calendar });
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", data: err });
        }
    });

    router.put('/:id', async (req: Request, res: Response) => {
        const id = req.params.id;
        const updates = req.body;

        // Validate ID
        if(!isValidObjectId(id)) {
            res.status(400).json({ message: "Invalid calendar ID", data: {} });
            return;
        }
        
        try {
            let calendar = await Calendar.findById(id);
            if(!calendar) {
                res.status(404).json({ message: "Calendar not found" });
                return; // Stops execution of post
            }

            // Update all calendar attributes slated in updates
            Object.keys(updates).forEach((key) => {
                if(key in calendar && updates[key] !== undefined) {
                    calendar[key] = updates[key]; // ignore error
                }
            });

            // save updated calendar
            const updatedCalendar = await calendar.save();
            res.status(200).json({ message: "Calendar updated", data: updatedCalendar });
        } catch (err) {
            res.status(500).json({ message:"Internal server error - FIND / DELETE", data:err });
        }
    });

    router.delete('/:id', async (req: Request, res: Response) => {
        const id = req.params["id"];

        // check if ID is valid
        if(!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid calendar ID", data: {} });
            return;
        }
        try {
            const result = await Calendar.findByIdAndDelete(id);
            if (result) res.status(200).json({ mesage: "Calendar deleted", data: result });
            else res.status(404).json({ message: "Calendar not found", data:{} });
        } catch (err) {
            res.status(500).json({ message:"Internal server error - FIND / DELETE", data:err });
        }
    });

    return router;
};

export default calendarsRouter;
