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
    day: {
        type: String,
        default: "1"
    },
    mealEntries: {
        type: [mealSchema],
        default: [{timeOfDay: "morning", mealName: "breakfast", desription:"most important meal of the day"}]
    }

});


var calendarSchema = new mongoose.Schema ({
    tags : {
        type:[String],
        default:[]
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    privacy: {
        type: String,
        default: "private"
    },
    ratings: {
        type: [],
        default: []
    },
    days: {
        type: [daySchema],
        default: [{day: "1"},{day: "2"},{day: "3"},{day: "4"},{day: "5"},{day: "6"},{day: "7"}]
    },
    name: {
        type: String,
        default: "",
        required: true,
    },
    description: {
        type: String,
        default: "",
    }
});

const Calendar = mongoose.model('Calendar', calendarSchema);
const Day = mongoose.model('Day', daySchema);
const Meal = mongoose.model('Meal', mealSchema);

export { Calendar, Day, Meal };
