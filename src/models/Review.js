const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userId: String,
    bookId: String,
    content: String,
    score: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review