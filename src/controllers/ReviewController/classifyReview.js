const { classifyReview } = require('../../services/mlService.js');

const classifyReviewController = async (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).send({ error: 'Conteúdo do comentário é obrigatório' });
    }

    try {
        const classification = await classifyReview(content);
        res.status(200).send({ classification });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = classifyReviewController;
