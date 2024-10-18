const Rating = require("../../models/Rating");
const Book = require("../../models/Book");

const getBookAverage = async (req, res) => {
    try {
        const bookId = req.query.bookId;

        const existingBook = await Book.findById(bookId);

        if (!existingBook) {
            return res.status(404).send({ error: "Book not found!" });
        }

        const ratings = await Rating.find({ bookId: bookId });

        if (ratings.length === 0) {
            return res.status(404).send({ error: "No ratings found for this book." });
        }

        const totalRating = ratings.reduce((sum, rating) => sum + rating.score, 0);
        const averageRating = totalRating / ratings.length;

        res.status(200).send({ averageRating });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
    }
};

module.exports = getBookAverage;