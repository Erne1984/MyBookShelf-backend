const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    isbn: String,
    reviews: [String], 
    ratingsReference: [String], 
    score: Number,
})

const Book = mongoose.model("Books", bookSchema);

module.exports = Book