const Book = require("../../models/Book");

const queryBookByName = async (req, res) => {
    try {
        const query = req.query.query;
        const limit = parseInt(req.query.limit) || 20;

        if (!query) {
            return res.status(400).send({ error: "bookName is required" });
        }

        const filteredBooks = await Book.find({ title: { $regex: query, $options: "i" } })
            .limit(limit);

        if (filteredBooks.length === 0) {
            return res.status(404).send({ error: "No books found matching the query." });
        }

        res.status(200).send({ books: filteredBooks });
    } catch (error) {
        console.error("Error fetching data: ", error);
        res.status(500).send({ error: "Internal server error" });
    }
};

module.exports = queryBookByName;