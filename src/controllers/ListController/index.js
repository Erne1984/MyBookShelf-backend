const createList = require("./createList");
const getUserList = require("./getUserLists");
const getUserReadingStatus = require("./getUserReadingStatus");
const addUserBookStatus = require("./addUserBookStatus");
const deleteBookFromShelfs = require("./deleteBookFromShelfs");

module.exports = {
    addUserBookStatus,
    createList,
    getUserList,
    getUserReadingStatus,
    deleteBookFromShelfs
}