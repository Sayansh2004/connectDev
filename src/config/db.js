require("dotenv").config();
const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect("mongodb+srv://sayanshc_db_user:jKvNQEpZ2HaozH7P@cluster0.hnkekaz.mongodb.net/?appName=Cluster0");
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Unable to connect to the database", err.message);
    }
}

//connectDb();

module.exports = connectDb;