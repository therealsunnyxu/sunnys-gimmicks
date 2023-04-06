const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required!"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [false, "For recovery purposes, it's a good idea to have an email associated with this account."],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    }
})

module.exports = mongoose.model("User", userSchema)