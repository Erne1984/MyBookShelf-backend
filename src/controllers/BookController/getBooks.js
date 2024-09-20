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

module.exports = getBooks;