const Book = require("../../models/Book");

const getBooks = async (req, res) => {
    try {
        const books = await Book.find().limit(100);

        res.status(200).send(books);
    } catch (err) {
        console.error("Error getting books", err);
        res.status(500).send({ error: err.message });
    }
};

module.exports = getBooks;