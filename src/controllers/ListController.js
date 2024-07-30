const User = require("../models/User");
const List = require("../models/List");


const createList = async (req, res) => {
    try {
        const { userId, listName, booksIsbn, public } = req.body;

        const currentlyUser = await User.findById(userId);
        if (!currentlyUser) return res.status(404).send({ error: "User not found!" });

        const newList = List({
            userId: userId,
            listName: listName,
            booksIsbn: booksIsbn,
            public: public,
        })

        await newList.save();

        await User.findByIdAndUpdate(
            userId,
            { $push: { lists: newList._id } },
            { new: true }
        );

        return res.status(201).send(newList);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createList
}