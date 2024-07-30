const Book = require("../models/Book");

const openLibraryApi = "https://openlibrary.org/search.json?q="

const queryBookByName = async (req, res) => {
    try {
        const bookName = req.body.bookName;

        if (!bookName) {
            return res.status(400).send({ error: "bookName is required" });
        }

        const response = await fetch(openLibraryApi + encodeURIComponent(bookName));

        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }

        const data = await response.json();

        res.send(data);
    } catch (error) {
        console.error("Error fetching data: ", error);
        res.status(500).send({ error: error.message });
    }
};

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

module.exports = {
    queryBookByName,
    createBookReference
}