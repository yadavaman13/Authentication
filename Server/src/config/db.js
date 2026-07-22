const config = require('./config');
const mongoose = require('mongoose');

async function connectDB(){
    try{
        await mongoose.connect(config.MONGO_URI);

        console.log("DB connected successfully!")
    }
    catch{
        console.log("Error connecting DB");
    }
}

module.exports = connectDB;