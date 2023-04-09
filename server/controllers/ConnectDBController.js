require('dotenv').config()
const mongoose = require('mongoose')
const options = {}
const CONNECTION_URL = process.env.MONGODB_URL
const connectDB = async (startBehavior) => {
    try {
        console.log("Connecting to database...")
        await mongoose.connect(CONNECTION_URL, options)
        console.log("Connected to database!")
        startBehavior()
        
    } catch (error) {
        console.log("Cannot connect to database!", error)
        process.exit(1)
    }
}

module.exports = connectDB