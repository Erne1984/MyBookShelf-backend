const Review = require("../../models/Review");

const filterReviewsByClassification = async (req, res) => {
    try {
        const { bookId, classification } = req.query;

        if (!bookId || !classification) {
            return res.status(400).send({ error: "Os parâmetros 'bookId' e 'classification' são obrigatórios." });
        }

        const validClassifications = ["positivo", "negativo", "neutro"];
        if (!validClassifications.includes(classification)) {
            return res.status(400).send({ error: "O parâmetro 'classification' deve ser 'positivo', 'negativo' ou 'neutro'." });
        }

        const filteredReviews = await Review.find({ bookId, classification })
            .populate('userId', 'username imgUserUrl')
            .populate('ratingId', 'score')
            .exec();

        if (!filteredReviews || filteredReviews.length === 0) {
            return res.status(200).send([]);
        }

        const formattedReviews = filteredReviews.map(review => ({
            reviewId: review._id,
            userId: review.userId ? review.userId._id : null,
            username: review.userId ? review.userId.username : "Usuário desconhecido",
            imgUserUrl: review.userId ? review.userId.imgUserUrl : null,
            ratingId: review.ratingId ? review.ratingId._id : null,
            score: review.ratingId ? review.ratingId.score : null,
            content: review.content,
            classification: review.classification,
            createdAt: review.createdAt,
        }));

        res.status(200).send(formattedReviews);
    } catch (error) {
        console.error("Erro ao filtrar reviews:", error);
        return res.status(500).send({ error: "Erro interno do servidor" });
    }
};

module.exports = filterReviewsByClassification;