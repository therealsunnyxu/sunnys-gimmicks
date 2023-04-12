require('dotenv').config()
const userModel = require('../models/UserModel')
const bcrypt = require('bcrypt')
const jsonWebToken = require('jsonwebtoken')
//const nodeMailer = require('nodemailer')
const emailValidator = require('email-validator')

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
            if (!username || !email || !password || !confirmPassword) return res.status(400).json({
                msg: "Fill in all required fields!",
                code: "BLANK_FIELDS"
            })
            // validate username meets character conventions
            if (isUsernameValid(username) == false) return res.status(400).json({
                msg: "Username can only contain upper and lowercase letters from A-Z, and the following special characters: -_.@",
                code: "BAD_CHARACTERS"
            })
            
            // find username availability
            const user = await userModel.findOne({username: req.body.username}).exec()
            if (user) return res.status(400).json({
                msg: "Username already taken! Choose another one.",
                code: "USER_ALREADY_EXISTS"
            })

            // if email is supplied, check if the email meets character convention
            // TBD: work on username and password first
            if (!emailValidator.validate(email)) return res.status(400).json({
                msg: "E-mail contains invalid characters!",
                code: "BAD_EMAIL"
            })

            // validate password meets character conventions
            if (password.length < 8) return res.status(400).json({
                msg: "Password must contain at least 8 characters!",
                code: "PW_TOO_SHORT"
            })

            if (password.localeCompare(confirmPassword) != 0) return res.status(400).json({
                msg: "Password and confirm password fields do not match!",
                code: "PW_MISMATCH"
            })

            // insert username and password into database
            const newHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))
            const newUser = new userModel({
                username,
                email,
                password: newHash
            })

            await newUser.save()

            return res.status(200).json({
                msg: "Signed up!", 
                code: "SIGN_UP_SUCCESS"
            })
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
                msg: "Username or password fields are empty!",
                code: "BLANK_FIELDS"
            })
            const user = await userModel.findOne({username: req.body.username}).exec()
            if (!user) return res.status(400).json({
                msg: "User not registered!",
                code: "USER_DOES_NOT_EXIST"
            })
            
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if (!validPassword) return res.status(403).json({
                msg: "Wrong password!",
                code: "WRONG_PASSWORD"
            })

            // do cookie stuff to keep the user logged in
            /*
            const loginCookie = bakeCookie(
                res,
                { userName: req.body.username },
                'refresh_cookie',
                900
            )

            if (!loginCookie) {
                return res.status(500).json({
                    code: "COOKIE_ERROR"
                })
            }
            */
            const session = req.session
            session.username = user.username
            
            if (!session) {
                return res.status(500).json({
                    code: "SESSION_GET_ERROR"
                })
            }
            if (!session.username || session.username != user.username) {
                return res.status(500).json({
                    code: "SESSION_MODIFY_ERROR"
                })
            }

            return res.status(200).json({
                msg: "Logged in!",
                code: "LOG_IN_SUCCESS"
            })
        } catch(err) {
            console.log(err.message)
            return res.status(500).json({
                msg: err.message
            })
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
            /*
            res.clearCookie(
                'refresh_cookie', 
                {
                    path: '/'
                }
            )
            */
            req.session.destroy()
            return res.status(200).json({
                msg: "Logged out!", 
                code: "LOG_OUT_SUCCESS"
            })
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

/*
 * @description bakeCookie: use JWT to make a token
 * @param {num} expireTime: expiry time of cookie in seconds
 * @param {String} cookieName
 * @return unbaked cookie, aka just the JSO for it
*/
function bakeCookie(res, payload, cookieName, expireTime, cookiePath) {
    var mCookiePath = cookiePath || "/"
    var jwtExpireTime = String(expireTime) + "s"
    const newToken = jsonWebToken.sign(
        payload,
        process.env.TOKEN,
        {
            expiresIn: jwtExpireTime
        }
    )

    return res.cookie(
        cookieName, 
        newToken,
        {
            httpOnly: true,
            path: mCookiePath,
            maxAge: expireTime
        }
    )
}

module.exports = userController