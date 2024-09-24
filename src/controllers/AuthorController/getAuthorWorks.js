const Book = require("../../models/Book");

const getAuthorWorks = async (req, res) => {
    try {
        const authorKey = req.query.authorKey;

        if (!authorKey) throw new Error("Author key not defined");

        const response = await fetch(`https://openlibrary.org/authors/${authorKey}/works.json?limit=10`);

        if (!response.ok) throw new Error("Error in fetching data from API: " + response.statusText);

        const works = await response.json();

        const sortedWorks = await Promise.all(
            works.entries.map(async (work) => {
                const openlibraryKey = work.key.slice(7);

                if (!openlibraryKey) return null;

                let existingBook = await Book.findOne({ 'identifiers.openlibrary': openlibraryKey });

                if (!existingBook) {
                    const description = typeof work.description === 'string'
                        ? work.description
                        : JSON.stringify(work.description) || "Descrição não disponível";

                    const newBook = new Book({
                        identifiers: {
                            isbn_10: "",
                            isbn_13: "",
                            openlibrary: [work.key],
                        },
                        bookDescri: description,
                        reviews: [],
                        ratings: [],
                        score: 0,
                    });

                    existingBook = await newBook.save();
                }

                return {
                    ...work,
                    score: existingBook.score,
                };
            })
        );

        const validWorks = sortedWorks.filter(work => work !== null);
        validWorks.sort((a, b) => b.score - a.score);

        res.send(validWorks.slice(0, 5));

    } catch (err) {
        console.error("Error in fetching author: ", err.message);
        res.status(500).send({ error: err.message });
    }
}

module.exports = getAuthorWorks;