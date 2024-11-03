const createBook = require("./createBook");
const getBookByIsbn = require("./getBookByIsbn");
const getBooks = require("./getBooks");
const queryBookByName = require("./queryBookByName");
const editBookDescri = require(".//editBookDescri");
const getBooksByIds = require("./getBooksByIds");

module.exports = {
    createBook,
    getBookByIsbn,
    getBooks,
    queryBookByName,
    editBookDescri,
    getBooksByIds
}