const User = require("../models/User");
const List = require("../models/List");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
    try {
        const userList = await User.find();

        res.json(userList)
    } catch (err) {
        console.log(err)
    }
}

const createUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { email, password, userName, imgUserUrl, reviews } = req.body;

        if (!email || !password || !userName) {
            return res.status(400).send("Dados incompletos.");
        }

        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).send("Email já está em uso.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            userName,
            imgUserUrl,
            lists: [],
            reviews
        });

        await newUser.save({ session });

        const defaultLists = [
            { name: "Lidos", booksIsbn: [], public: false, userId: newUser._id },
            { name: "Pretendo Ler", booksIsbn: [], public: false, userId: newUser._id },
            { name: "Lendo", booksIsbn: [], public: false, userId: newUser._id }
        ];

        await List.insertMany(defaultLists, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).send(newUser);
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        session.endSession();

        console.error("Erro ao criar usuário:", error);
        res.status(500).send("Erro ao criar usuário");
    }
};

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

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).send("Email não encontrado!");
        }

        const passwordIsValid = await bcrypt.compare(password, existingUser.password);
        if (!passwordIsValid) {
            return res.status(401).send("Senha incorreta");
        }

        res.status(200).send(existingUser);
    } catch (error) {
        console.error("Erro ao tentar realizar o login:", error);
        res.status(500).send("Erro ao logar usuário");
    }
};

module.exports = {
    getUsers,
    createUser,
    deleteUser,
    updatedUser,
    loginUser
}