const User = require("../../models/User");

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

module.exports = deleteUser;