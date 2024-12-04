const Reply = require("../../models/Reply");
const Review = require("../../models/Review");

const addReply = async (req, res) => {
    try {
        const { respondingToReference, userId, content } = req.body;

        if (!respondingToReference || !userId || !content) {
            return res.status(400).json({ error: "Dados insuficientes fornecidos." });
        }

        const newReply = new Reply({
            respondingToReference,
            userId,
            content,
        });

        const savedReply = await newReply.save();

        await Review.findByIdAndUpdate(respondingToReference, {
            repliesReference: savedReply._id,
        });

        res.status(201).json({ message: "Resposta adicionada com sucesso!", reply: savedReply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao adicionar a resposta." });
    }
};

module.exports = addReply;