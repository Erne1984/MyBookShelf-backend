const Review = require("../../models/Review");

const getBookReviews = async (req, res) => {
    try {
        const bookId = req.query.bookId;

        const bookReviews = await Review.find({ bookId })
            .populate('userId', 'username imgUserUrl')
            .populate('ratingId', 'score')
            .exec();

        if (!bookReviews || bookReviews.length === 0) {
            return res.status(404).send("Livro não encontrado ou sem reviews");
        }

        const formattedReviews = bookReviews.map(review => ({
            reviewId: review._id,
            userId: review.userId ? review.userId._id : null,
            username: review.userId ? review.userId.username : "Usuário desconhecido",
            imgUserUrl: review.userId ? review.userId.imgUserUrl : null,
            ratingId: review.ratingId ? review.ratingId._id : null,
            score: review.ratingId ? review.ratingId.score : null,
            content: review.content,
            createdAt: review.createdAt,
        }));

        res.status(200).send(formattedReviews);
    } catch (error) {
        console.error("Erro ao buscar as reviews:", error);
        return res.status(500).send({ error: "Erro interno do servidor" });
    }
};

module.exports = getBookReviews;
