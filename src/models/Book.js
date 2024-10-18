const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    authors: [
        {
            name: String,
            key: String,
            url: String
        }
    ],
    identifiers: {
        "isbn_10": [],
        "isbn_13": [],
        "openlibrary": []
    },
    title: String,
    numberOfPages: Number,
    bookDescri: String,
    publishers: [],
    publish_date: String,
    subjects: [{ "name": String, "url": String }] || undefined,
    cover: {
        small: String,
        medium: String,
        large: String
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
    score: Number,
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;