const User = require("../../models/User"); // Corrigido
const Book = require("../../models/Book");

const addUserBookStatus = async (req, res) => {
    try {
        const { userId, bookId, status: bookStatus } = req.body;

        if (!bookId) return res.status(400).send("bookId not received!");
        if (!userId) return res.status(400).send("userId not received!");
        if (!bookStatus) return res.status(400).send("bookStatus not received!");

        const user = await User.findById(userId);
        if (!user) return res.status(404).send("User not found!");

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).send("Book not found!");

        user.toReadList = user.toReadList.filter(id => id.toString() !== bookId);
        user.readingList = user.readingList.filter(id => id.toString() !== bookId);
        user.readedList = user.readedList.filter(id => id.toString() !== bookId);

        if (bookStatus === "Quero Ler") {
            user.toReadList.push(bookId);
        } else if (bookStatus === "Lendo") {
            user.readingList.push(bookId);
        } else if (bookStatus === "Lido") {
            user.readedList.push(bookId);
        } else {
            return res.status(400).send("Invalid status value!");
        }

        await user.save();

        res.status(201).send({ msg: `Status updated to ${bookStatus}` });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
    }
};

module.exports = addUserBookStatus;