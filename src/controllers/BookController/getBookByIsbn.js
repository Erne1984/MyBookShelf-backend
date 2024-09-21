const Book = require("../../models/Book");

const isImageValid = async (url) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok && response.headers.get('Content-Type').startsWith('image/');
    } catch (error) {
        console.error('Error checking image validity:', error);
        return false;
    }
};


const getBookByIsbn = async (req, res) => {
    try {
        const isbnBook = req.query.isbn;

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
            combinedBookData.bookDescri = existingBook.bookDescri;
            combinedBookData.reviews = existingBook.reviews;
            combinedBookData.ratings = existingBook.ratings;
            combinedBookData.score = existingBook.score;
        } else {
            const newBookReference = new Book({
                isbn: isbnBook,
                bookDescri: "",
                reviews: [],
                ratings: [],
                score: 0
            });

            await newBookReference.save();

            combinedBookData.bookDescri = "";
            combinedBookData.reviews = [];
            combinedBookData.ratings = [];
            combinedBookData.score = 0;
        }

        const bookIsbn = combinedBookData.identifiers.isbn_13 ? combinedBookData.identifiers.isbn_13[0] : combinedBookData.identifiers.isbn_10[0];
        const bookMoreInfoResponse = await fetch(`https://openlibrary.org/isbn/${bookIsbn}.json`);

        if (bookMoreInfoResponse.ok) {
            const bookMoreInfo = await bookMoreInfoResponse.json();

            combinedBookData.language = bookMoreInfo.languages[0].key.slice(11);

            const editionsKey = bookMoreInfo.works[0].key;

            const editionsResponse = await fetch(`https://openlibrary.org/works/${editionsKey.slice(7)}/editions.json`);

            const editions = await editionsResponse.json();

            const editionPromises = editions.entries.map(async (edition) => {
                let coverUrl = null;

                if (edition.isbn_13) {
                    coverUrl = `https://covers.openlibrary.org/b/isbn/${edition.isbn_13[0]}-M.jpg`;
                } else if (edition.key) {
                    coverUrl = `https://covers.openlibrary.org/b/olid/${edition.key.split('/')[2]}-M.jpg`;
                }

                if (coverUrl && await isImageValid(coverUrl)) {
                    return {
                        ...edition,
                        coverUrl 
                    };
                } else {
                    return null;
                }
            });

            combinedBookData.editions = (await Promise.all(editionPromises)).filter(edition => edition !== null);

        }

        res.status(200).send(combinedBookData);

    } catch (error) {
        console.error("Error fetching or saving book data: ", error);
        res.status(500).send({ error: error.message });
    }
};

module.exports = getBookByIsbn;
