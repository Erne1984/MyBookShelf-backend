const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    userName: String,
    imgUserUrl: String,
    lists: Array,
    reviews: Array,
    creationDate: Date,
})

const User = mongoose.model('Users', userSchema);

module.exports = User;