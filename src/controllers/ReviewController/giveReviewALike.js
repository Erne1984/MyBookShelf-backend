const Review = require("../../models/Review");

const toggleReviewLike = async (req, res) => {
    try {
        const { userId, reviewId } = req.body;

        if (!userId || !reviewId) {
            return res.status(400).json({ message: "Parâmetros inválidos" });
        }

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review não encontrada" });
        }

        const likeIndex = review.likes.indexOf(userId);

        if (likeIndex !== -1) {
            review.likes.splice(likeIndex, 1);
            await review.save();
            return res.status(200).json({
                liked: false,
                totalLikes: review.likes.length,
                message: "Like removido com sucesso!",
            });
        }

        review.likes.push(userId);
        await review.save();

        res.status(200).json({
            liked: true,
            totalLikes: review.likes.length,
            message: "Like adicionado com sucesso!",
        });
    } catch (err) {
        console.error("Erro ao processar a ação de like:", err);
        res.status(500).json({ message: "Erro no servidor" });
    }
};


module.exports = toggleReviewLike;