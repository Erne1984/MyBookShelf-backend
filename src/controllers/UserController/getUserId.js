const User = require("../../models/User");

const getUserId = async (req, res) => {
    try {
        res.status(200).json({ userId: req.user.id });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar o ID do usuário' });
    }

};

module.exports = getUserId;