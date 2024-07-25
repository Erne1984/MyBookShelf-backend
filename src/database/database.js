const mongoose = require('mongoose');

const url = "mongodb+srv://dbAdmin:^891Lj@cluster0.n8emyxs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connectDb(){
    try{
        const connection = mongoose.connect(url);
        console.log("Conectado com o banco")
    }catch(e){
        console.log(e)
    }
}

module.exports = connectDb;