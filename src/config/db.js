require("dotenv").config();
const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Unable to connect to the database", err.message);
    }
}

//connectDb();

module.exports = connectDb;