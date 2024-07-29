const User = require("../models/User");
const mongoose = require("mongoose");

const getUsers = async (req, res) => {
    try {
        const userList = await User.find();

        res.json(userList)
    } catch (err) {
        console.log(err)
    }
}

const createUser = async (req, res) => {
    try {
        const { email, password, userName, imgUserUrl, lists, reviews } = req.body;

        const newUser = new User({
            email,
            password,
            userName,
            imgUserUrl,
            lists,
            reviews
        });

        await newUser.save();

        res.status(201).send("Usuário criado com sucesso");
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).send("Erro ao criar usuário");
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ error: "ID inválido" });
        }

        const result = await User.deleteOne({ _id: userId });

        if (result.deletedCount === 0) {
            return res.status(404).send({ error: "Usuário não encontrado" });
        }

        res.send({ message: "Usuário deletado com sucesso" });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

const updatedUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ error: "ID inválido" });
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ error: "Usuário não encontrado" });
        }

        res.send(updatedUser);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


module.exports = {
    getUsers,
    createUser,
    deleteUser,
    updatedUser
}