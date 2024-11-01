// TO IMPLEMETING YET
const User = require("../../models/User");
const List = require("../../models/List");

const addBookToList = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction()

    try {

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.log(error);
        return res.status(500).send({ error: "Internal server error" })
    }
}