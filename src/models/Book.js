const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    isbn_10: String,
    isbn_13: String,
    bookDescri: String,
    reviews: [String], 
    ratings: [String], 
    score: Number,
})

const Book = mongoose.model("Books", bookSchema);

module.exports = Book;