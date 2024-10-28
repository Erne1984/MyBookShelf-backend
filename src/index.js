require('dotenv').config();
const express = require("express");
const db = require("./database/database");

const routes = require("./routes/routes");
const cors = require('cors');
const app = express();
 

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());
app.use("/", routes);


const port = process.env.PORT || 3030;

db();

app.listen(port, () => {
    console.log(`Rodando na porta ${port}`)
})