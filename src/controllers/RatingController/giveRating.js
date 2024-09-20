const mongoose = require("mongoose");
const Rating = require("../../models/Rating");
const User = require("../../models/User");
const Book = require("../../models/Book");

const giveRating = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, bookId, score } = req.body;
        if (!userId || !bookId || !score) return res.status(400).send("Incomplete data");

        const currentlyUser = await User.findById(userId);
        if (!currentlyUser) return res.status(404).send({ error: "User not found!" });

        const currentlyBook = await Book.findById(bookId);
        if (!currentlyBook) return res.status(404).send({ error: "Book not found!" });

        let existingRating = await Rating.findOne({ userId, bookId });

        if (existingRating) {
            existingRating.score = score;
            await existingRating.save({ session });
        } else {
            const newRating = new Rating({
                userId,
                bookId,
                score
            });

            await newRating.save({ session });

            await User.findByIdAndUpdate(
                userId,
                { $push: { ratingsReference: newRating._id } },
                { new: true, session }
            );

            await Book.findByIdAndUpdate(
                bookId,
                { $push: { ratingsReference: newRating._id } },
                { new: true, session }
            );
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).send("Rating created or updated successfully");
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        res.status(500).send({ error: "Internal server error" });
    }
}

module.exports = giveRating;