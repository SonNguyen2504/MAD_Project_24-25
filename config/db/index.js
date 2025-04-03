const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    await mongoose.connect(process.env.DB_URI)
        .then(() => {
            console.log('MongoDB connected successfully');
        }).catch((err) => {
            console.log('MongoDB connection failed');
            console.error(err);
        });
}

module.exports = { connectDB };