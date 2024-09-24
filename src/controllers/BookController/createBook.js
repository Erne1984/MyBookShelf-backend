const Book = require("../../models/Book");

const createBook = async (req, res) => {
    try {
        const { isbn10, isbn13, openlibraryKey, title, authors, numberOfPages, bookDescri, publishers, publish_date, subjects, cover } = req.body;

        console.log(req.body)

        if (!isbn10 && !isbn13 && !openlibraryKey) {
            return res.status(400).send({ error: "No ID for the book was received" });
        }

        const newBookReference = new Book({
            authors,
            identifiers: {
                isbn_10: [isbn10],
                isbn_13: [isbn13],
                openlibrary: [openlibraryKey]
            },
            title,
            numberOfPages,
            bookDescri,
            publishers,
            publish_date,
            subjects,
            cover,
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
};

module.exports = createBook;