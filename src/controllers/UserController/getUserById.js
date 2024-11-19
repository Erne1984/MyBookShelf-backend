const User = require("../../models/User");

const getUserById = async (req, res) => {
    try {
        const userId = req.query.userid;

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar o ID do usuário' + err });
    }
}

module.exports = getUserById;