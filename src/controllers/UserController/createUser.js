const User = require("../../models/User");
const List = require("../../models/List");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const createUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ message: "Dados incompletos." });
        }

        const existingEmailUser = await User.findOne({ email }).session(session);
        if (existingEmailUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: "Email já está em uso." });
        }

        const existingUsernameUser = await User.findOne({ username }).session(session);
        if (existingUsernameUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: "Nome de usuário já está em uso." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            username
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

        res.status(201).json(newUser);
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        session.endSession();

        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ message: "Erro ao criar usuário" });
    }
};

module.exports = createUser