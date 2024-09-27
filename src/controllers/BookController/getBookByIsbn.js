const Book = require("../../models/Book");

const getBookByIsbn = async (req, res) => {
    try {
        const bookIdentifier = req.query.isbn;

        if (!bookIdentifier) {
            return res.status(400).send({ error: "ISBN is required" });
        }

        let existingBook = await Book.findOne({
            $or: [
                { "identifiers.isbn_10": bookIdentifier },
                { "identifiers.isbn_13": bookIdentifier },
                { "identifiers.openlibrary": bookIdentifier }
            ]
        });

        if (existingBook) {
            return res.status(200).send(existingBook);
        }

        const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${bookIdentifier}&format=json&jscmd=data`);

        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }

        const apiData = await response.json();
        const bookDataFromAPI = apiData[`ISBN:${bookIdentifier}`];

        if (!bookDataFromAPI) {
            return res.status(404).send({ error: "Book not found in API" });
        }

        const identifiers = bookDataFromAPI.identifiers ? {
            isbn_10: bookDataFromAPI.identifiers.isbn_10 ? bookDataFromAPI.identifiers.isbn_10[0] : "",
            isbn_13: bookDataFromAPI.identifiers.isbn_13 ? bookDataFromAPI.identifiers.isbn_13[0] : "",
            openlibrary: bookDataFromAPI.identifiers.openlibrary ? bookDataFromAPI.identifiers.openlibrary[0] : ""
        } : {};


        const coverImages = identifiers.isbn_10[0] ? {
            small: `https://covers.openlibrary.org/b/isbn/${identifiers.isbn_10}-S.jpg`,
            medium: `https://covers.openlibrary.org/b/isbn/${identifiers.isbn_10}-M.jpg`,
            large: `https://covers.openlibrary.org/b/isbn/${identifiers.isbn_10}-L.jpg`
        } : {
            small: `https://covers.openlibrary.org/b/isbn/${identifiers.isbn_13}-S.jpg`,
            medium: `https://covers.openlibrary.org/b/isbn/${identifiers.isbn_13}-M.jpg`,
            large: `https://covers.openlibrary.org/b/isbn/${identifiers.isbn_13}-L.jpg`
        };

        const subjects = bookDataFromAPI.subjects
            ? bookDataFromAPI.subjects.map(subject => ({
                name: subject.name || subject,
                url: subject.url || ""
            }))
            : [];

        const bookData = {
            authors: bookDataFromAPI.authors ? bookDataFromAPI.authors.map(author => ({
                name: author.name,
                key: author.key,
                url: author.url
            })) : [],
            identifiers: identifiers,
            title: bookDataFromAPI.title,
            numberOfPages: bookDataFromAPI.number_of_pages || null,
            bookDescri: bookDataFromAPI.description || "",
            publishers: bookDataFromAPI.publishers || [],
            publish_date: bookDataFromAPI.publish_date || "",
            subjects: subjects,
            cover: coverImages,
            reviews: [],
            ratings: [],
            score: 0
        };

        const newBookReference = new Book({
            authors: bookData.authors,
            identifiers: {
                isbn_10: [identifiers.isbn_10],
                isbn_13: [identifiers.isbn_13],
                openlibrary: [identifiers.openlibrary]
            },
            title: bookData.title,
            numberOfPages: bookData.numberOfPages,
            bookDescri: bookData.bookDescri,
            publishers: bookData.publishers,
            publish_date: bookData.publish_date,
            subjects: bookData.subjects,
            cover: bookData.cover,
            reviews: [],
            ratings: [],
            score: 0
        });

        await newBookReference.save();

        res.status(201).send(newBookReference);

    } catch (error) {
        console.error("Error fetching or saving book data: ", error);
        res.status(500).send({ error: error.message });
    }
};

module.exports = getBookByIsbn;