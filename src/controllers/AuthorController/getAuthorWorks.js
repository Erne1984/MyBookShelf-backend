const Book = require("../../models/Book");
const Author = require("../../models/Author");

const getAuthorWorks = async (req, res) => {
    try {
        const { authorId } = req.query;

        if (!authorId) throw new Error("Author ID not defined");

        const author = await Author.findById(authorId).populate('works');

        if (!author) throw new Error("Author not found");

        const authorWorks = author.works;

        if (!authorWorks || authorWorks.length === 0) {
            return res.status(404).send({ message: "No works found for this author" });
        }

        const books = await Book.find({
            '_id': { $in: authorWorks }
        }).sort({ score: -1 });

        res.send(books.slice(0, 5));

    } catch (err) {
        console.error("Error in fetching author works: ", err.message);
        res.status(500).send({ error: err.message });
    }
}

module.exports = getAuthorWorks;