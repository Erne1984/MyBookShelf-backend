const createBook = require('./createBook');
const Book = require("../../models/Book");

const getBookByIsbn = async (req, res) => {
    try {
        const isbnBook = req.query.isbn;

        if (!isbnBook) {
            return res.status(400).send({ error: "ISBN is required" });
        }

        let existingBook = await Book.findOne({
            $or: [{ "identifiers.isbn_10": isbnBook }, { "identifiers.isbn_13": isbnBook }]
        });

        if (existingBook) {
            return res.status(200).send(existingBook);
        }

        const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbnBook}&format=json&jscmd=data`);

        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }

        const apiData = await response.json();
        const bookDataFromAPI = apiData[`ISBN:${isbnBook}`];

        if (!bookDataFromAPI) {
            return res.status(404).send({ error: "Book not found in API" });
        }

        const { title, number_of_pages, publish_date, publishers, subjects, cover, identifiers } = bookDataFromAPI;
        const coverImages = cover ? {
            small: cover.small ? `https://covers.openlibrary.org/b/id/${cover.small}-S.jpg` : undefined,
            medium: cover.medium ? `https://covers.openlibrary.org/b/id/${cover.medium}-M.jpg` : undefined,
            large: cover.large ? `https://covers.openlibrary.org/b/id/${cover.large}-L.jpg` : undefined,
        } : {};

        const bookData = {
            authors: bookDataFromAPI.authors ? bookDataFromAPI.authors.map(author => ({
                name: author.name,
                key: author.key
            })) : [],
            identifiers: {
                isbn_10: identifiers.isbn_10 || [],
                isbn_13: identifiers.isbn_13 || [],
                openlibrary: identifiers.openlibrary || []
            },
            title,
            numberOfPages: number_of_pages || null,
            bookDescri: bookDataFromAPI.description || "",
            publishers: publishers || [],
            publish_date: publish_date || "",
            subjects: subjects || [],
            cover: coverImages,
            reviews: [],
            ratings: [],
            score: 0
        };

        const newBookReference = await createBook(bookData);

        res.status(200).send(newBookReference);

    } catch (error) {
        console.error("Error fetching or saving book data: ", error);
        res.status(500).send({ error: error.message });
    }
};

module.exports = getBookByIsbn;