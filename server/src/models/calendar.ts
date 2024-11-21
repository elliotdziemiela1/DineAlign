import mongoose from 'mongoose';

var mealSchema = new mongoose.Schema({
    time: {
        type:String,
        default: "breakfast"
    },
    name: {
        type: String,
        default:"Unnamed Meal"
    },
    description: {
        type: String,
        default:"Most important meal of the day"
    },
    link : {
        type: String,
        default: "https://www.the-girl-who-ate-everything.com/bacon-egg-and-potato-breakfast-skillet/"
    }
})

var daySchema = new mongoose.Schema ({
    descriptor: {
        type: String,
        default: "This is a healthy day"
    },
    mealEntries: {
        type: [mealSchema],
        default: [{time: "morning", name: "breakfast", 
            description:"most important meal of the day", link: "https://www.the-girl-who-ate-everything.com/bacon-egg-and-potato-breakfast-skillet/"}]
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
        default: [{descriptor: "1"},{descriptor: "2"},{descriptor: "3"},{descriptor: "4"},{descriptor: "5"},{descriptor: "6"},{descriptor: "7"}]
    },
    name: {
        type: String,
        default: "",
        required: true,
    },
    description: {
        type: String,
        default: "Example Calendar description",
    }
});

const Calendar = mongoose.model('Calendar', calendarSchema);
const Day = mongoose.model('Day', daySchema);
const Meal = mongoose.model('Meal', mealSchema);

export { Calendar, Day, Meal };
