const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI;

async function connectDb(){
    try{
        mongoose.connect(url);
        console.log("Conectado com o banco")
    }catch(e){
        console.log(e)
    }
}

module.exports = connectDb;