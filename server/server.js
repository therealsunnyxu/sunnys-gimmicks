require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./controllers/ConnectDBController')

const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
// do that app.use stuff with session

connectDB.setStartBehavior(() => {
    app.listen(PORT, ()=>{
        console.log('Started server at port', PORT)
    })
})
connectDB.connectToDB()