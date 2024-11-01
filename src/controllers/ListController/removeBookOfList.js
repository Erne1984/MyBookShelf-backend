const mongoose = require("mongoose");
const User = require("../../models/User");
const Book = require("../../models/Book");
const List = require("../../models/List");

const removeBookOfList = async (req, res) => {
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

        const bookIndex = list.books.indexOf(bookId);
        if (bookIndex > -1) {
            list.books.splice(bookIndex, 1);
        } else {
            return res.status(404).send({ error: "Book not found in this list" });
        }

        await list.save({ session });
        await session.commitTransaction();
        session.endSession();

        res.status(200).send({ message: "Book removed from list successfully" });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).send({ error: "Error in removing book from list" });
    }
}

module.exports = removeBookOfList;