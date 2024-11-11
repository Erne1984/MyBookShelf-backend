const Book = require("../../models/Book");
const Rating = require("../../models/Rating");

const getBestRatedBooks = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;

        const bestRatedBooks = await Book.aggregate([
            {
                $lookup: {
                    from: "ratings",
                    localField: "_id",
                    foreignField: "bookId",
                    as: "ratingsData"
                }
            },
            {
                $addFields: {
                    averageRating: { $avg: "$ratingsData.score" }
                }
            },
            {
                $match: {
                    averageRating: { $gt: 0 }
                }
            },
            {
                $sort: { averageRating: -1 }
            },
            {
                $limit: limit
            }
        ]);

        res.status(200).json(bestRatedBooks);
    } catch (err) {
        console.error("Error getting books", err);
        res.status(500).send({ error: err.message });
    }
};

module.exports = getBestRatedBooks;