const User = require("../../models/User");

const UserrId = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        res.status(200).json({ userId: req.user.id, isModerator: user.isModerator });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar o ID do usuário' });
    }
};

module.exports = UserrId;
