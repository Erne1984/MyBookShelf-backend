const List = require("../../models/List");
const Book = require("../../models/Book");
const User = require("../../models/User");

const getBooksFromCustomList = async (req, res) => {
    try {
        const { userId, listId } = req.query;

        if (!userId || !listId) {
            return res.status(400).json({ error: "Os IDs do usuário e da lista são necessários" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const list = await List.findOne({ _id: listId, userId }).populate("books");
        
        if (!list) {
            return res.status(404).json({ error: "Lista não encontrada para o usuário especificado" });
        }

        res.status(200).json({ books: list.books });
    } catch (err) {
        console.error("Erro ao obter livros da lista personalizada:", err);
        res.status(500).json({ error: "Erro ao buscar livros da lista personalizada do usuário" });
    }
}

module.exports = getBooksFromCustomList;