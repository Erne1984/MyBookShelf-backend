const Review = require("../../models/Review");
const Rating = require("../../models/Rating")

const updateReview = async (req, res) => {
    try {
        const { userId, content, score, bookId } = req.query;

        if (!userId || !bookId) {
            return res.status(400).send("Parâmetros bookId e userId são obrigatórios.");
        }

        const userReview = await Review.findOne({ bookId: bookId, userId: userId });

        if (!userReview) {
            return res.status(404).send("Resenha não encontrada.");
        }

        if (content) userReview.content = content;
        if (score) await Rating.findByIdAndUpdate(userReview.ratingId, { score: score });

        await userReview.save();

        res.status(200).send(userReview);

    } catch (error) {
        console.error("Erro ao atualizar a review:", error);
        return res.status(500).send({ error: "Erro interno do servidor" });
    }
};

module.exports = updateReview;
