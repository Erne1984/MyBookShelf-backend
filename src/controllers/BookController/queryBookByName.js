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

module.exports = queryBookByName