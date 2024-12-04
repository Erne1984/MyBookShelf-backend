const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },  
    content: String,
    ratingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rating' },  
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    repliesReference: { type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }, 
    classification: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
