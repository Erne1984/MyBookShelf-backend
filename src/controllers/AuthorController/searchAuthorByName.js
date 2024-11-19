const Author = require("../../models/Author");

const searchAuthorByName = async (req, res) => {
    try {
        const query = req.query.query;
        const limit = parseInt(req.query.limit) || 20;

        if (!query) {
            return res.status(400).send({ error: "Author name is required" });
        }

        const filteredAuthors = await Author.find({ name: { $regex: query, $options: "i" } })
            .limit(limit);

        res.status(200).send(filteredAuthors);
    } catch (error) {
        console.error("Error fetching authors: ", error);
        res.status(500).send({ error: "Internal server error" });
    }
};

module.exports = searchAuthorByName;