const mongoose = require("mongoose");
const ListSchema = require("./List").schema;

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: String,
    userName: String,
    imgUserUrl: String,
    lists: [ListSchema],
    reviews: Array,
    ratingsReference: Array,
    creationDate: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('Users', userSchema);

module.exports = User;