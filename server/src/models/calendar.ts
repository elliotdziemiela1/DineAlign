import mongoose, { modelNames, mongo } from 'mongoose';

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
            description:"Skillet for breakfast", link: "https://www.the-girl-who-ate-everything.com/bacon-egg-and-potato-breakfast-skillet/"},
            {time: "noon", name: "Lunch", 
                description:"Just a snack for lunch", link: ""},
            {time: "evening", name: "Dinner", 
                description:"Grilled Chicken Salad for dinner", link: "https://www.the-girl-who-ate-everything.com/bacon-egg-and-potato-breakfast-skillet/"}]
    }

});

var ratingSchema = new mongoose.Schema ({
    thumb: {
        type: Number, // 0 for thumbs down, 1 for thumbs up
        default: 1
    },
    review: {
        type: String,
        default: ""
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    }
})


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
        type: Number,
        default: 0
    },
    ratings: {
        type: [ratingSchema],
        default: []
    },
    followedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    days: {
        type: [daySchema],
        default: [{descriptor: "First Day"},{descriptor: "Second Day"},{descriptor: "Third Day"},{descriptor: "Fourth Day"},{descriptor: "Fifth Day"},{descriptor: "Sixth Day"},{descriptor: "Seventh Day"}]
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
