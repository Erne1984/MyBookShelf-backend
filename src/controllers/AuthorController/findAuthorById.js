const Author = require("../../models/Author");
const mongoose = require("mongoose");

const findAuthorById = async (req, res) => {
    try {
        const { authorId } = req.query;

        if (!mongoose.Types.ObjectId.isValid(authorId)) {
            return res.status(400).send({ error: "ID inválido" });
        }

        const author = await Author.findById(authorId);

        if (!author) {
            return res.status(404).send({ error: "Autor não encontrado" });
        }

        res.status(200).send(author);
    } catch (err) {
        console.error("Erro ao buscar o autor:", err.message);
        res.status(500).send({ error: "Erro interno do servidor" });
    }
};

module.exports = findAuthorById;
