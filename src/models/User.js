const mongoose = require("mongoose");
const ListSchema = require("./List").schema;

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: String,
    realname: String, 
    username: String,
    imgUserUrl: String,
    toReadList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    readingList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    readedList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    lists: [ListSchema],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    ratingsReference: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
    friendsReference: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dateBirth: Date,
    country: String,
    city: String,
    gender: String,
    aboutMe: String,
    isModerator: Boolean,
    creationDate: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
