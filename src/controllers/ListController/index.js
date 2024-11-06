const createList = require("./createList");
const getUserList = require("./getUserLists");
const getUserReadingStatus = require("./getUserReadingStatus");
const addUserBookStatus = require("./addUserBookStatus");
const addBookToList = require("./addBookToList");
const deleteBookFromShelfs = require("./deleteBookFromShelfs");
const removeBookOfList = require("./removeBookOfList");
const getAllBooksUser = require("./getAllBooksUser");
const getCustomListsUser = require("./getCustomListsUser");
const getBooksFromCustomList = require("./getBooksFromCustomList");

module.exports = {
    addUserBookStatus,
    createList,
    getUserList,
    getUserReadingStatus,
    deleteBookFromShelfs,
    addBookToList, 
    removeBookOfList,
    getAllBooksUser,
    getCustomListsUser,
    getBooksFromCustomList
}