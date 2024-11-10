const mongoose = require("mongoose");
const User = require("./User");
const Book = require("./Book");

const authorSchema = new mongoose.Schema({
    name: String, 
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    imageUrl: String, 
    bio: String,
    works: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    dateBirth: Date,
    dateDeath: Date
})

const Author = mongoose.model("Authors", authorSchema);

module.exports = Author;