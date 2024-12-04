const Reply = require("../../models/Reply");

const getReplies = async (req, res) => {
    try {
        const { respondingToReference } = req.params;

        if (!respondingToReference) {
            return res.status(400).json({ error: "ID da review não fornecido." });
        }

        const replies = await Reply.find({ respondingToReference })
            .populate("userId", "username imgUserUrl")
            .sort({ createdAt: -1 });

        if (!replies || replies.length === 0) {
            return res.status(204).send("Sem respostas para essa review.");
        }

        const formattedReplies = replies.map(reply => ({
            replyId: reply._id,
            respondingToReference: respondingToReference,
            userId: reply.userId ? reply.userId._id : null,
            username: reply.userId ? reply.userId.username : "Usuário desconhecido",
            imgUserUrl: reply.userId ? reply.userId.imgUserUrl : null,
            content: reply.content,
            createdAt: reply.createdAt,
        }));

        res.status(200).json(formattedReplies);
    } catch (err) {
        console.error("Erro ao recuperar respostas:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

module.exports = getReplies;