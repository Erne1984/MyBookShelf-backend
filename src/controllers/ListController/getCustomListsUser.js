const User = require("../../models/User");
const List = require("../../models/List");
const Book = require("../../models/Book");

const getCustomListsUser = async (req, res) => {
    try {
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({ error: "O ID do usuário é necessário" });
        }

        const customLists = await List.find({ userId }).populate("books");

        if (!customLists || customLists.length === 0) {
            return res.status(404).json({ error: "Nenhuma lista personalizada encontrada para o usuário" });
        }

        res.status(200).json(customLists);
    } catch (err) {
        console.error("Erro ao obter listas do usuário:", err);
        res.status(500).json({ error: "Erro ao buscar listas de livros do usuário" });
    }
};

module.exports = getCustomListsUser;
