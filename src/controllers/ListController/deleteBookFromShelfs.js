const User = require("../../models/User");
const List = require("../../models/List");

const deleteBookFromShelfs = async (req, res) => {
    try {
        const { userId, bookId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        user.toReadList = user.toReadList.filter(id => !id.equals(bookId));
        user.readingList = user.readingList.filter(id => !id.equals(bookId));
        user.readedList = user.readedList.filter(id => !id.equals(bookId));

        await user.save();

        const lists = await List.find({ userId: user._id });
        for (const list of lists) {
            list.booksIsbn = list.booksIsbn.filter(id => !id.equals(bookId));

            if (list.booksIsbn.length === 0) {
                await List.findByIdAndDelete(list._id);
            } else {
                await list.save();
            }
        }

        res.status(200).send({ message: "Book removed from all lists successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
    }
};

module.exports = deleteBookFromShelfs;