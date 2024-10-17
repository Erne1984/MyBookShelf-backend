const mongoose = require("mongoose");
const Book = require("../../models/Book");

const editBookDescri = async (req, res) => {
    try {
        const bookId = req.body.bookId;
        const bookDescri = req.body.bookDescri;

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ error: "ID do livro inválido" });
        }

        const updateBook = await Book.findOneAndUpdate({ _id: bookId }, { $set: { bookDescri: bookDescri } }, { new: true });

        if (!updateBook) {
            return res.status(404).send({ error: "Livro não encontrado" });
        }

        res.send(updateBook);
    } catch (err) {
        console.error("Error editing Book", err);
        res.status(500).send({ error: err.message });
    }
}

module.exports = editBookDescri;