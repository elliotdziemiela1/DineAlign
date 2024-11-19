import mongoose from 'mongoose';


var UserSchema = new mongoose.Schema ({
    username: {
        type:String,
        required:true,
        unique: true
    },
    password: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique: true
    },
    bio: {
        type:String,
        default: ""
    },
    age : {
        type: Number,
    },
    gender: {
        type: String,
    },
    location: {
        type: String,
        default: "Unknown"
    }, 
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    followsDiet : {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    dietsCompleted: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    dietsCreated: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    }

});

const User = mongoose.model('User', UserSchema);
export default User;