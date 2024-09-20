const Book = require("../../models/Book");

const getBookByIsbn = async (req, res) => {
    try {
        const isbnBook = req.body.isbn;

        if (!isbnBook) {
            return res.status(400).send({ error: "ISBN is required" });
        }

        const existingBook = await Book.findOne({ isbn: isbnBook });

        const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbnBook}&format=json&jscmd=data`);

        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }

        const apiData = await response.json();
        const bookDataFromAPI = apiData[`ISBN:${isbnBook}`];

        if (!bookDataFromAPI) {
            return res.status(404).send({ error: "Book not found in API" });
        }

        let combinedBookData = { ...bookDataFromAPI };

        if (existingBook) {
            combinedBookData.reviews = existingBook.reviews;
            combinedBookData.ratings = existingBook.ratings;
            combinedBookData.score = existingBook.score;
        } else {
            const newBookReference = new Book({
                isbn: isbnBook,
                reviews: [],
                ratings: [],
                score: 0
            });

            await newBookReference.save();

            combinedBookData.reviews = [];
            combinedBookData.ratings = [];
            combinedBookData.score = 0;
        }

        res.status(200).send(combinedBookData);

    } catch (error) {
        console.error("Error fetching or saving book data: ", error);
        res.status(500).send({ error: error.message });
    }
};

module.exports = getBookByIsbn;