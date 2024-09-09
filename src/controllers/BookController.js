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

const getBooks = async (req, res) => {
    try {
        const books = await Book.find();

        const bookDataPromises = books.map(async (book) => {
            const isbn = book.isbn;
            if (isbn) {
                try {
                    const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    const bookData = data[`ISBN:${isbn}`];

                    if (bookData) {
                        bookData.score = book.score;
                    }

                    return bookData;
                } catch (error) {
                    console.error(`Error fetching data for ISBN: ${isbn}`, error);
                    return null;
                }
            }
            return null;
        });

        const bookData = await Promise.all(bookDataPromises);
        const filteredBookData = bookData.filter(book => book !== null);

        res.json(filteredBookData);
    } catch (err) {
        console.error("Error getting books", err);
        res.status(500).send({ error: err.message });
    }
};

module.exports = {
    queryBookByName,
    getBookByIsbn,
    createBookReference,
    getBooks
}