const Review = require("../models/Review");
const User = require("../models/User");
const Book = require("../models/Book");

const createReviews = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, content, score, bookIsbn } = req.body;
        if (!bookIsbn) return res.status(400).send({ error: "bookIsbn is required" });

        const currentlyUser = await User.findById(userId);
        if (!currentlyUser) return res.status(404).send({ error: "User not found!" });

        const book = await Book.findOne({ isbn: bookIsbn });
        if (!book) return res.status(404).send({ error: "Book not found" });

        const newReview = new Review({
            userId,
            bookId: book._id,
            content,
            score
        });
        await newReview.save();

        await User.findByIdAndUpdate(
            userId,
            { $push: { reviews: newReview._id } },
            { new: true }
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(201).send(newReview);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.log(error);
        return res.status(500).send({ error: "Internal server error" });
    }
};

module.exports = {
    createReviews
};