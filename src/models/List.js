const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    public: Boolean,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const List = mongoose.model("List", ListSchema);

module.exports = List;
