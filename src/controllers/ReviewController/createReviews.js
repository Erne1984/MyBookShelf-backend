const { classifyReview } = require('../../services/mlService');
const mongoose = require('mongoose');
const Review = require("../../models/Review");
const Rating = require("../../models/Rating");
const User = require("../../models/User");
const Book = require("../../models/Book");

const createReviews = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, content, score, bookId } = req.body;

        if (!bookId) {
            return res.status(400).send({ error: "bookId is required" });
        }

        const currentlyUser = await User.findById(userId).session(session);
        if (!currentlyUser) {
            return res.status(404).send({ error: "User not found!" });
        }

        const book = await Book.findById(bookId).session(session);
        if (!book) {
            return res.status(404).send({ error: "Book not found" });
        }
        const classification = await classifyReview(content);
        const newReview = new Review({
            userId,
            bookId: book._id,
            content,
            classification
        });
        await newReview.save({ session });

        const newRating = new Rating({
            userId,
            bookId: book._id,
            score,
            reviewId: newReview._id
        });

        await newRating.save({ session });

        newReview.ratingId = newRating._id;
        await newReview.save({ session });

        await User.findByIdAndUpdate(
            userId,
            { 
                $push: { 
                    reviews: newReview._id, 
                    ratingsReference: newRating._id 
                } 
            },
            { new: true, session }
        );

        await Book.findByIdAndUpdate(
            bookId,
            { 
                $push: { 
                    reviews: newReview._id, 
                    ratings: newRating._id 
                } 
            },
            { new: true, session }
        );

        await session.commitTransaction();
        return res.status(201).send(newReview);
        
    } catch (error) {
        await session.abortTransaction();
        console.error("Erro ao criar a review:", error);
        return res.status(500).send({ error: "Internal server error" });
    } finally {
        session.endSession();
    }
};

module.exports = createReviews;