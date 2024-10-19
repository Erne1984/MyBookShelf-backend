const Review = require("../../models/Review");

const getBookReviews = async (req, res) => {
    try {
        const bookId = req.query.bookId;

        // Busca as reviews com os dados relacionados populados
        const bookReviews = await Review.find({ bookId })
            .populate('userId', 'username imgUserUrl')  // Popula username e avatar do usuário
            .populate('ratingId', 'score')  // Popula a nota da avaliação (score)
            .exec();

        if (!bookReviews || bookReviews.length === 0) {
            return res.status(404).send("Livro não encontrado ou sem reviews");
        }

        // Mapeia os dados para enviar ao cliente
        const formattedReviews = bookReviews.map(review => ({
            reviewId: review._id,  // Inclui o ID da review
            userId: review.userId ? review.userId._id : null,  // Inclui o ID do usuário
            username: review.userId ? review.userId.username : "Usuário desconhecido",  // Nome do usuário ou placeholder
            imgUserUrl: review.userId ? review.userId.imgUserUrl : null,  // URL do avatar do usuário, se existir
            ratingId: review.ratingId ? review.ratingId._id : null,  // Inclui o ID da avaliação (rating)
            score: review.ratingId ? review.ratingId.score : null,  // Nota da avaliação, se existir
            content: review.content,  // Conteúdo da review
            createdAt: review.createdAt,  // Data da criação da review
        }));

        res.status(200).send(formattedReviews);
    } catch (error) {
        console.error("Erro ao buscar as reviews:", error);
        return res.status(500).send({ error: "Erro interno do servidor" });
    }
};

module.exports = getBookReviews;
