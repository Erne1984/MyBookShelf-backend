const User = require("../../models/User");
const List = require("../../models/List");
const mongoose = require("mongoose");

const deleteBookFromShelfs = async (req, res) => {
    try {
        const { userId, bookId } = req.body;

        const bookObjectId = new mongoose.Types.ObjectId(bookId);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        user.toReadList = user.toReadList.filter(id => !id.equals(bookObjectId));
        user.readingList = user.readingList.filter(id => !id.equals(bookObjectId));
        user.readedList = user.readedList.filter(id => !id.equals(bookObjectId));
        await user.save();

        const lists = await List.find({ userId: user._id });
        for (const list of lists) {
            list.books = list.books.filter(id => !id.equals(bookObjectId));
            await list.save();
        }

        res.status(200).send({ message: "Book removed from all lists successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
    }
};

module.exports = deleteBookFromShelfs;
