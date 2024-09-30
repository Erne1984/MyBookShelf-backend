const openLibraryApi = "https://openlibrary.org/search.json?q=";
const Book = require("../../models/Book");

const queryBookByName = async (req, res) => {
    try {
        const query = req.query.query;

        if (!query) {
            return res.status(400).send({ error: "bookName is required" });
        }

        const response = await fetch(openLibraryApi + encodeURIComponent(query));

        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }

        const data = await response.json();

        const filteredBooks = await Promise.all(
            data.docs.filter(book => {
                return book.cover_i && book.title && (book.isbn || book.lccn || book.oclc);
            }).map(async (book) => {
                const isbn10 = book.isbn ? book.isbn.find(isbn => isbn.length === 10) : undefined;
                const isbn13 = book.isbn ? book.isbn.find(isbn => isbn.length === 13) : undefined;

                let existingBook = await Book.findOne({
                    $or: [
                        { "identifiers.isbn_10": isbn10 },
                        { "identifiers.isbn_13": isbn13 },
                        { "identifiers.openlibrary": book.key }
                    ]
                });

                if (existingBook) {
                    return existingBook;
                }

                const newBookReference = new Book({
                    authors: book.author_name ? book.author_name.map(author => ({
                        name: author,
                        key: book.author_key ? book.author_key[0] : "",
                        url: book.author_key ? `https://openlibrary.org/authors/${book.author_key[0]}` : ""
                    })) : [],
                    identifiers: {
                        isbn_10: isbn10 ? [isbn10] : [],
                        isbn_13: isbn13 ? [isbn13] : [],
                        openlibrary: [book.key]
                    },
                    title: book.title,
                    numberOfPages: book.number_of_pages_median || null,
                    bookDescri:  "",
                    publishers: book.publisher || [],
                    publish_date: book.first_publish_year || "",
                    subjects: book.subject ? book.subject.map(subject => ({
                        name: subject,
                        url: `https://openlibrary.org/subjects/${encodeURIComponent(subject)}`
                    })) : [],
                    cover: {
                        small: `https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`,
                        medium: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
                        large: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                    },
                    reviews: [],
                    ratings: [],
                    score: 0
                });

                await newBookReference.save();
                return newBookReference;
            })
        );

        res.send({ books: filteredBooks });
    } catch (error) {
        console.error("Error fetching data: ", error);
        res.status(500).send({ error: error.message });
    }
};

module.exports = queryBookByName;
