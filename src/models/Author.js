const mongoose = require("mongoose");
const User = require("./User");

const authorSchema = new mongoose.Schema({
    keyOpenLibrary: { type: String, required: true },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bio: String,
})

const Author = mongoose.model("Authors", authorSchema);

module.exports = Author;