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
        console.log("here!");
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
        }
        
        const owner_id = new Types.ObjectId(ownedBy);
        
        // Validate privacy
        const privacy = req.body["privacy"];
        if(privacy && !validPrivacy.includes(privacy)) {
            res.status(400).json({ message: "Invalid privacy option", data: {} });
        }
        
        var addedCalendar = new Calendar({
            ownedBy: owner_id,
            privacy: privacy || undefined,
            dayOffset: req.body["dayOffset"] || undefined,
        });
        
        const result = await addedCalendar.save();
        res.status(201).json({ message: "Calendar created successfully", data: result});
        } catch(err) {
            res.status(500).json({ message: "Internal Service Error", data: err });
        }
    });
    
    router.get('/:id', async (req: Request, res:Response) => {
        const query = Calendar.find();
        const id = req.params["id"];
        try{
            const result = await query.exec();
            if (result && result.length > 0){
                res.status(200).json({message: "Valid response", data:result});
            }
            else{
                res.status(404).json({message: "Calendar not found", data:{}})
            }
        }
        catch (err) {
            res.status(500).json({message:"Internal server error - GET", data:err});
        }
    });

    router.delete('/:id', async (req: Request, res:Response) => {
        const query = Calendar.find();
        const id = req.params["id"];
        const u_id = new mongoose.Types.ObjectId(id);
        query.where({_id: u_id});
        try{
            const result = await query.exec();
            if (result && result.length > 0){
                try{
                    
                    const deleteRes = Calendar.deleteOne({_id: u_id});
                    res.status(200).json({message: "Calendar deleted successfully", data:deleteRes});
                }
                catch (deleterr){
                    res.status(500).json({message:"Internal server error - DELETE", data:deleterr});
                }
            }
            else{
                res.status(404).json({message: "Calendar not found", data:{}})
            }
        }
        catch (err) {
            res.status(500).json({message:"Internal server error - FIND / DELETE", data:err});
        }
    });

    return router;
};

export default calendarsRouter;
