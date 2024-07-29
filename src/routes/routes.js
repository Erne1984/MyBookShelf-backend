const express = require("express");
const routes = express.Router();
const UserController = require("../controllers/UserController");
const BookController = require("../controllers/BookController");

routes.get("/", (req, res) => {
    res.send("Olá Mundo");
});

// USER ROUTES
routes.get("/getUsers", UserController.getUsers);
routes.post("/createUser", UserController.createUser);
routes.delete("/deleteUser/:id", UserController.deleteUser);
routes.put("/updateUser/:id", UserController.updatedUser);

// BOOK ROUTES
routes.get("/queryBook", BookController.queryBookByName);
routes.post("/createBookReference", BookController.createBookReference);


module.exports = routes; 