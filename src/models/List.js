const mongoose = require("mongoose");


const ListSchema = new mongoose.Schema({
    userId: String,
    name: String,
    booksIsbn: [String],
    public: Boolean,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const List = mongoose.model("listas", ListSchema);

module.exports = List;