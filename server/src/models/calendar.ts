import mongoose from 'mongoose';

var mealSchema = new mongoose.Schema({
    timeOfDay: {
        type:String,
    },
    mealName: {
        type: String,
        default:"Unnamed Meal"
    },
    description: {
        type: String,
        default:""
    },
    link : {
        type: String,
        default: ""
    }
})

var daySchema = new mongoose.Schema ({
    days: {
        type: String,
    },
    mealEntry: {
        type: mealSchema
    }

});


var calendarSchema = new mongoose.Schema ({
    tags : {
        type:[String],
        default:[]
    },
    ownedBy: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    privacy: {
        type: String,
        default: "unlisted"
    },
    ratings: {
        type: [],
        default: []
    },
    dayOffset: {
        type: Number,
        default: 0
    },
    planDays: {
        type: [daySchema],
        default: []
    }

});

const Calendar = mongoose.model('Calendar', calendarSchema);
const Day = mongoose.model('Day', daySchema);
const Meal = mongoose.model('Meal', mealSchema);

export default {Calendar, Day, Meal};