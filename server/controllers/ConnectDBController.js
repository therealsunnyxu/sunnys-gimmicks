require('dotenv').config()
const mongoose = require('mongoose')
const options = {
    authSource: "admin",
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PWD
}
const CONNECTION_URL = process.env.MONGODB_URL
const connectDB = {
    startBehavior: () => {},
    setStartBehavior: (behavior) => {
        this.startBehavior = behavior
    },
    connectToDB: async () => {
        try {
            console.log("Connecting to database...")
            await mongoose.connect(CONNECTION_URL, options)
            console.log("Connected to database!")
            if (this.startBehavior) this.startBehavior()
            
        } catch (error) {
            console.log("Cannot connect to database!", error)
            process.exit(1)
        }
    },
    closeConnectionFromDB: async () => {
        try {
            await mongoose.connection.close()
        } catch (error) {
            console.log("Cannot close connection, killing program instead!", error)
            process.exit(1)
        }
    }
}

/*async (startBehavior) => {
    try {
        console.log("Connecting to database...")
        await mongoose.connect(CONNECTION_URL, options)
        console.log("Connected to database!")
        startBehavior()
        
    } catch (error) {
        console.log("Cannot connect to database!", error)
        process.exit(1)
    }
}*/

module.exports = connectDB