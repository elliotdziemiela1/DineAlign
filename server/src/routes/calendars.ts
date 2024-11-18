import { Router, Request, Response } from 'express';
import { Calendar, Day, Meal } from "../models/calendar";
import mongoose from 'mongoose';

module.exports = function (router:Router) {
    const validPrivacy = ["unlisted", "private", "public"];
    const calendarRoute = router.route("/calendars");
    const calendarIdRoute = router.route("/calendars/:id");

    calendarRoute.get(async (req: Request, res: Response) =>{
        const query = Calendar.find();
        try{
            const result = await query.exec();
            res.status(200).json({message: "Valid response", data:result});
        }
        catch (err) {
            res.status(500).json({message:"Internal server error - GET", data:err});
        }
    });

    calendarRoute.post(async (req:Request, res:Response) => {
        if (req.body){
            var addedCalendar = new Calendar();
            if (req.body["ownedBy"]){
                const owner_id = new mongoose.Types.ObjectId(req.body["ownedBy"]);
                addedCalendar["ownedBy"] = owner_id;
            }
            if (req.body["privacy"] && (validPrivacy.includes(req.body["privacy"]))) addedCalendar["privacy"] = req.body["privacy"];
            if (req.body["dayOffset"]) addedCalendar["dayOffset"] = req.body["dayOffset"];

            try{
                const result = await addedCalendar.save();
                res.status(201).json({message: "Calendar created successfully", data:result});
            }   
            catch (adderr){
                res.status(500).json({message: "Internal Server Error", data:adderr});
            }

        }
        else{
            res.status(400).json({message: "Request body missing", data: {}});
        }
    });

    calendarIdRoute.get(async (req: Request, res:Response) => {
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

    calendarIdRoute.delete(async (req: Request, res:Response) => {
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
}