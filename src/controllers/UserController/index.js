const getUsers = require("./getUsers");
const createUser = require("./createUser");
const deleteUser = require("./deleteUser");
const updateUser = require("./updateUser");
const loginUser = require("./loginUser");
const getUserProfile = require("./getUserProfile");
const getUserId = require("./getUserId");
const uploadUserImg = require("./uploadUserImg");

module.exports = {
    getUsers,
    createUser,
    deleteUser,
    updateUser,
    loginUser,
    getUserProfile,
    getUserId,
    uploadUserImg
};
