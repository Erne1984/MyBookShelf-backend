const User = require("../../models/User");

const getUsers = async (req, res) => {
    try {
        const userList = await User.find();
        res.json(userList);
    } catch (err) {
        console.log(err);
        res.status(500).send("Erro ao buscar usuários.");
    }
};

module.exports = getUsers;