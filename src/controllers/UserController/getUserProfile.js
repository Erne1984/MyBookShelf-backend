const User = require("../../models/User");

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).send("Usuário não encontrado.");
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
        res.status(500).send("Erro ao buscar perfil do usuário");
    }
};

module.exports = getUserProfile;