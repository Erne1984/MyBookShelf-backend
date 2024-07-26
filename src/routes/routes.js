const express = require("express");
const routes = express.Router();
const User = require("../models/User");

routes.get("/", (req, res) => {
    res.send("Olá Mundo");
})

routes.post("/newUser", async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userName = req.body.userName;
        const imgUserUrl = req.body.imgUserUrl;
        const lists = req.body.lists;
        const reviews = req.body.reviews;

        const newUser = new User({
            email: email,
            password: password,
            userName: userName,
            imgUserUrl: imgUserUrl,
            lists: lists,
            reviews: reviews,
            creationDate: new Date()
        });

        await newUser.save();

        res.status(201).send("Usuário criado com sucesso");
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).send("Erro ao criar usuário");
    }
});

module.exports = routes;
