const userModel = require('../models/UserModel')
const bcrypt = require('bcrypt')
const jsonWebToken = require('jsonwebtoken')
//const nodeMailer = require('nodemailer')
const nodeFetch = require('node-fetch')

/**
 * controller userController
 * Contains functions necessary for user sign up and sign in
 */
const userController = {
    /*
     * @description async func signUp: Signs users up with a desired username and password
     * @param {*} req: a JSO containing username, email, password, and confirm password
     * @param {*} res: the response to send back to the user
     */
    signUp: async (req, res) => {
        try {
            const {
                username, 
                email,
                password, 
                confirmPassword
            } = req.body
            if (!username || !password || !confirmPassword) return res.status(400).json({
                msg: "Fill in all required fields!"
            })
            // validate username meets character conventions
            if (isUsernameValid(username) == false) return res.status(406).json({
                msg: "Username can only contain upper and lowercase letters from A-Z, and the following special characters: -_.@"
            })
            
            // find username availability
            const user = await userModel.findOne({username: req.body.username}).exec()
            if (user) return res.status(403).json({
                msg: "Username already taken! Choose another one."
            })

            // if email is supplied, check if the email meets character convention
            if (email) {
                console.log("i know everything muahaha")
            } 

            // validate password meets character conventions
            if (password.length < 8) return res.status(400).json({
                msg: "Password must contain at least 8 characters!"
            })

            if (password.localeCompare(confirmPassword) != 0) return res.status(406).json({
                msg: "Password and confirm password fields do not match!"
            })

            // insert username and password into database
            

            return res.status(200).json({msg: "Nice"})
            // return res.status(200).json({msg: "Signed up!"})
        } catch(err) {
            console.log(err)
            return res.status(500).json({msg: err.message})
        }
    },
    /*
     * @description async func logIn: Logs a user in if the credentials are correct
     * @param {*} req: a JSO containing username and password
     * @param {*} res: the response to send back to the user
    */
    logIn: async (req, res) => {
        try {
            const {
                username, 
                password
            } = req.body
            // TBD: add option to login via email
            
            if (!username || !password) return res.status(401).json({
                msg: "Username or password fields are empty!"
            })
            const user = await userController.findOne({username})
            if (!user) return res.status(400).json({
                msg: "User not registered!"
            })
            
            const validPassword = await bcrypt.compareSync(password, userController.get("password"))
            if (!validPassword) return res.status(403).json({
                msg: "Wrong password!"
            })

            // do cookie stuff to keep the user logged in
            return res.status(200).json({msg: "Logged in!"})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    /*
     * @description async func logOut: Logs a user out on command
     * @param {*} req: a JSO (dummy)
     * @param {*} res: the response to send back to the user
    */
    logOut: async (req, res) => {
        const {} = req.body
        try {
            // do thing to destroy the login cookie
            return res.status(200).json({msg: "Logged out!"})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

/*
 * @description isUsernameValid
 * @param {String} username
 * @return {Boolean} whether the username meets conventions
*/
function isUsernameValid(username) {
    const invalidRegex = /[^A-Za-z0-9\-_.@]/g // everything but the valid stuff
    return (invalidRegex.test(username) == false)
}


module.exports = userController