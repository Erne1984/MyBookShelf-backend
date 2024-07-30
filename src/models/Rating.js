const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    userId: String,
    bookId: String,
    score: Number,
    creationDate: {
        type: Date,
        default: Date.now
    }
})

const Rating = mongoose.model("ratings", ratingSchema);

module.exports = Rating;