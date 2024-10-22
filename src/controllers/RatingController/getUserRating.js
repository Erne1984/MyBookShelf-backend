const Rating = require("../../models/Rating");

const getUserRating = async (req, res) => {
    try {
        const { userId, bookId } = req.query;

        const userRating = await Rating.findOne({ userId: userId, bookId: bookId });

        if (!userRating) res.status(404).send({ error: "Rating not found!" });

        res.status(200).json(userRating);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
    }
}


module.exports = getUserRating;