const express = require("express");
const db = require("./database/database")

const routes = require("./routes/routes"); 
const app = express();

app.use(express.json());
app.use("/", routes)

const port = 3030;

db();

app.listen(port, () => {
    console.log(`Rodando na porta ${port}`)
})