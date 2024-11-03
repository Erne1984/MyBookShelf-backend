const Book = require("../../models/Book"); 

async function getBooksByIds(req, res) {
    const { bookIds } = req.body;

    if (!Array.isArray(bookIds) || bookIds.length === 0) {
        return res.status(400).json({ error: "É necessário fornecer um array de IDs de livros." });
    }

    try {
        const books = await Book.find({ _id: { $in: bookIds } });

        return res.status(200).json(books);
    } catch (error) {
        console.error("Erro ao buscar livros:", error);
        return res.status(500).json({ error: "Erro ao buscar os livros." });
    }
}

module.exports = getBooksByIds;
