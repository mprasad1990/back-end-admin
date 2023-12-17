const mongoose = require('mongoose');
const mongoUri = "mongodb://127.0.0.1:27017/lakhis_cosmetics";

const connectToMongo = async() => {
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to Mongo Successgully.");
    } catch (error) {
        console.log("Database connection failed! " + error);
    }
}

module.exports = connectToMongo;