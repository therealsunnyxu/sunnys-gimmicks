require('dotenv').config()
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [false]
    },
    author: {
        type: String,
        required: [true, "Log in to post!"]
    },
    images: {
        // an array of strings pointing to addresses of images
        type: [String],
        required: [false],
        validate: [
            limitEntries(process.env.MAX_IMAGES), 
            "Unable to post more than".concat(" ", toString(process.env.MAX_IMAGES), "!")
        ]
    },
    postBody: {
        // a string pointing to an address of a Markdown text file
        type: String,
        required: [false]
    },
    tags: {
        type: [String]
    }
})

function limitEntries(limit) {
    return (value) => {
        return value.length <= limit
    }
}