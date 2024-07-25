const express = require("express");
const db = require("./database/database")

const app = express();
app.use(express.json());

const port = 3030;

db()

app.get("/", (req, res) => {
    res.send("Olá Mundo");
})


app.listen(port, () => {
    console.log(`Rodando na porta ${port}`)
})