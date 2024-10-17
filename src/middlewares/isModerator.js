const User = require("../models/User");

const isModerator = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        if (!user.isModerator) {
            return res.status(403).json({ error: "Acesso negado: você não é moderador" });
        }

        next();
    } catch (err) {
        res.status(500).json({ error: "Erro ao verificar o status de moderador" });
    }
};

module.exports = isModerator;