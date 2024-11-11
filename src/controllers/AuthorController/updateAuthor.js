const Author = require("../../models/Author");
const mongoose = require("mongoose");

const UpdateAuthor = async (req, res) => {
    try {
        const { authorId } = req.query;
        const updateData = req.body;

        if (!mongoose.Types.ObjectId.isValid(authorId)) {
            return res.status(400).send({ error: "ID inválido" });
        }

        const updatedAuthor = await Author.findByIdAndUpdate(
            { _id: authorId },
            { $set: updateData },
            { new: true, runValidators: true }
        )

        if (!updatedAuthor) {
            return res.status(404).send({ error: "Usuário não encontrado" });
        }

        res.send(updatedAuthor);
    } catch (err) {
        console.error("Error in updating author: ", err.message);
        res.status(500).send({ error: err.message });
    }
}

module.exports = UpdateAuthor;