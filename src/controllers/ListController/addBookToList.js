const mongoose = require("mongoose");
const User = require("../../models/User");
const List = require("../../models/List");
const Book = require("../../models/Book");

const addBookToList = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, listId, bookId } = req.body;

        const user = await User.findById(userId).session(session);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        const list = await List.findOne({ _id: listId, userId }).session(session);
        if (!list) {
            return res.status(404).send({ error: "List not found for this user" });
        }

        const book = await Book.findById(bookId).session(session);
        if (!book) {
            return res.status(404).send({ error: "Book not found" });
        }

        if (list.bookId.includes(bookId)) {
            return res.status(400).send({ error: "Book already in the list" });
        }

        list.bookId.push(bookId);
        await list.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).send({ message: "Book added to the list successfully" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        return res.status(500).send({ error: "Internal server error" });
    }
};

module.exports = addBookToList;