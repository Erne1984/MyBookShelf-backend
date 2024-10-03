const express = require("express");
const routes = express.Router();
const verifyToken = require("../middlewares/verifyToken ")

const UserController = require("../controllers/UserController/index");
const BookController = require("../controllers/BookController/index");
const ReviewController = require("../controllers/ReviewController/index");
const ListController = require("../controllers/ListController/index");
const RatingController = require("../controllers/RatingController/index");
const AuthorController = require("../controllers/AuthorController/index");

routes.get("/", (req, res) => {
    res.send("Olá Mundo");
});

// USER ROUTES
routes.get("/getUsers", UserController.getUsers);
routes.get('/profile', verifyToken, UserController.getUserProfile);
routes.get("/user/id", verifyToken, UserController.getUserId)
routes.post("/login", UserController.loginUser);
routes.post("/createUser", UserController.createUser);
routes.delete("/deleteUser/:id", UserController.deleteUser);
routes.put("/updateUser/:id", UserController.updateUser);

// BOOK ROUTES
routes.get("/queryBook", BookController.queryBookByName);
routes.get("/getBooks", BookController.getBooks);
routes.get("/getBookIsbn", BookController.getBookByIsbn);
routes.post("/createBook", BookController.createBook);

// AUTHOR ROUTES
routes.get("/getAuthor", AuthorController.getAuthor);
routes.get("/getAuthorWorks", AuthorController.getAuthorWorks);

// REVIEW ROUTES
routes.post("/createReviews", ReviewController.createReviews);

// LIST ROUTES
routes.post("/createList", ListController.createList);

// RATINGS ROUTES
routes.post("/giveRating", RatingController.giveRating);

module.exports = routes; 