const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

        const token = jwt.sign(
            { id: existingUser._id, email: existingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error("Erro ao tentar realizar o login:", error);
        res.status(500).send("Erro ao logar usuário");
    }
};

module.exports = loginUser;