const mongoose = require("mongoose");
const User = require("../../models/User");
const List = require("../../models/List");

const deleteList = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { listId, userId } = req.body;

        if (!listId || !userId) {
            return res.status(400).send({ error: "List ID and User ID are required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: "User not found." });
        }

        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).send({ error: "List not found." });
        }

        if (list.userId.toString() !== userId) {
            return res.status(403).send({ error: "You do not have permission to delete this list." });
        }

        await List.findByIdAndDelete(listId);

        await User.findByIdAndUpdate(
            userId,
            { $pull: { lists: { _id: listId } } },
            { new: true }
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(200).send({ message: "List deleted successfully." });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        return res.status(500).send({ error: "Internal server error." });
    }
};

module.exports = deleteList;