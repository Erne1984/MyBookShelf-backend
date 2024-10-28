const List = require("../../models/Book");

const getUserList = async (req, res) => {
    try {
        const userId = req.query.userId;

        const userLists = await List.find({ userId });

       res.status(200).send(userLists);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
    }
}

module.exports = getUserList;