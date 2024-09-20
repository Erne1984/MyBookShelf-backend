const Book = require("../../models/Book");

const createBookReference = async (req, res) => {
    try {
        const { isbn } = req.body;

        if (!isbn) {
            return res.status(400).send({ error: "ISBN is required" });
        }

        const newBookReference = new Book({
            isbn,
            reviews: [],
            ratings: [],
            score: 0
        });

        await newBookReference.save();

        res.status(201).send(newBookReference);
    } catch (error) {
        console.error("Error creating book reference: ", error);
        res.status(500).send({ error: error.message });
    }
}

module.exports = createBookReference;