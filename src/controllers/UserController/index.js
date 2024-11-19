const getUsers = require("./getUsers");
const createUser = require("./createUser");
const deleteUser = require("./deleteUser");
const updateUser = require("./updateUser");
const loginUser = require("./loginUser");
const getUserProfile = require("./getUserProfile");
const UserrId = require("./UserrId");
const getUserById = require("./getUserById");
const uploadUserImg = require("./uploadUserImg");
const toggleFollowUser = require("./toogleFollowUser");

module.exports = {
    getUsers,
    createUser,
    deleteUser,
    updateUser,
    loginUser,
    getUserProfile,
    UserrId,
    getUserById,
    uploadUserImg,
    toggleFollowUser
};
