const Review = require("../../models/Review");

const getUserReview = async (req, res) => {
    try {
        const { bookId, userId } = req.query;

        if (!bookId || !userId) {
            return res.status(400).send("Parâmetros bookId e userId são obrigatórios.");
        }

        const userReview = await Review.findOne({ bookId: bookId, userId: userId });

        if (!userReview) {
            return res.status(204).send("Usuário não tem review deste livro.");
        }

        res.status(200).send(userReview);
    } catch (error) {
        console.error("Erro ao buscar a review:", error);
        return res.status(500).send({ error: "Erro interno do servidor" });
    }
}

module.exports = getUserReview;