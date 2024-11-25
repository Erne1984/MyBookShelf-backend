const mongoose = require("mongoose");
const User = require("../../models/User");
const List = require("../../models/List");

const createList = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction()


    try {
        const { userId, listname, booksIsbn, public } = req.body;

        const currentlyUser = await User.findById(userId);
        if (!currentlyUser) return res.status(404).send({ error: "User not found!" });

        const newList = List({
            userId: userId,
            name: listname,
            booksIsbn: booksIsbn || [],
            public: public,
        })

        await newList.save();

        await User.findByIdAndUpdate(
            userId,
            { $push: { lists: newList._id } },
            { new: true }
        );

        session.commitTransaction();
        session.endSession();

        return res.status(201).send(newList);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.log(error);
        return res.status(500).send({ error: "Internal server error" })
    }
}

module.exports = createList;