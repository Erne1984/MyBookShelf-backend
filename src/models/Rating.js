const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },  
    score: { type: Number, required: true, min: 1, max: 5 },
    reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' }, 
    creationDate: {
        type: Date,
        default: Date.now
    }
})

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
