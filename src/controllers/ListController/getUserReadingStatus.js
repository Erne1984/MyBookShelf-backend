const User = require("../../models/User");
const Book = require("../../models/Book");

const getUserReadingStatus = async (req, res) => {
    try {
        const { bookId, userId } = req.query;

        if (!bookId) return res.status(400).send("bookId not received!");
        if (!userId) return res.status(400).send("userId not received!");

        const user = await User.findById(userId);

        if (!user) return res.status(404).send("User not found!");

        const book = await Book.findById(bookId);

        if (!book) return res.status(404).send("User not found!");

        let status = "Not found";

        if (user.toReadList && user.toReadList.includes(bookId)) {
            status = "Quero Ler";
        } else if (user.readingList && user.readingList.includes(bookId)) {
            status = "Lendo";
        } else if (user.readedList && user.readedList.includes(bookId)) {
            status = "Lido";
        }
        
        res.status(200).json( status );
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
    }
};

module.exports = getUserReadingStatus;