const List = require("../../models/List");
const User = require("../../models/User");
const Book = require("../../models/Book");

const getAllBooksUser = async (req, res) => {
    try {
        const { userId } = req.query;
        
        const user = await User.findById(userId).populate("toReadList readingList readedList");
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const standardBookIds = [
            ...user.toReadList.map(book => book._id),
            ...user.readingList.map(book => book._id),
            ...user.readedList.map(book => book._id)
        ];

        const customLists = await List.find({ userId }).populate("books");

        const customBookIds = customLists.flatMap(list => list.books.map(book => book._id));

        const allBookIds = [...new Set([...standardBookIds, ...customBookIds])];

        const books = await Book.find({ _id: { $in: allBookIds } });

        res.status(200).json(books);
    } catch (err) {
        console.error("Erro ao obter listas do usuário:", err);
        res.status(500).json({ error: "Erro ao buscar listas de livros do usuário" });
    }
};

module.exports = getAllBooksUser;