const mongoose = require("mongoose");
const Review = require("../../models/Review");
const User = require("../../models/User");
const Book = require("../../models/Book");
const Rating = require("../../models/Rating");

const deleteReview = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, bookId } = req.body;

        const review = await Review.findOneAndDelete({ userId, bookId }, { session });
        if (!review) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).send({ error: "Review not found" });
        }

        const user = await User.findById(userId).session(session);
        if (user) {
            user.reviews = user.reviews.filter(r => r.toString() !== review._id.toString());
            await user.save({ session });
        } else {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).send({ error: "User not found" });
        }

        const book = await Book.findById(bookId).session(session);
        if (book) {
            book.reviews = book.reviews.filter(r => r.toString() !== review._id.toString());

            const rating = await Rating.findOneAndDelete({ reviewId: review._id }, { session });
            if (rating) {
                book.ratings = book.ratings.filter(r => r.toString() !== rating._id.toString());
            }

            await book.save({ session });
        } else {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).send({ error: "Book not found" });
        }

        await session.commitTransaction();
        session.endSession();
        return res.status(200).send("Review e Rating excluídos com sucesso!");

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Erro ao excluir a review e a rating:", error);
        return res.status(500).send({ error: "Erro interno do servidor" });
    }
};

module.exports = deleteReview;