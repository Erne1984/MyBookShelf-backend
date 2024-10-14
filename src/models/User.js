const mongoose = require("mongoose");
const ListSchema = require("./List").schema;

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: String,
    username: String,
    imgUserUrl: String,
    toReadList: [],
    readingList: [],
    readedList: [],
    lists: [ListSchema],
    reviews: Array,
    ratingsReference: Array,
    friendsReference: [],
    dateBirth: Date,
    country: String,
    city: String,
    gender: String,
    aboutMe: String,
    creationDate: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('Users', userSchema);

module.exports = User;