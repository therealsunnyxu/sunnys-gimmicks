const userController = require('../controllers/UserController')
const connectDB = require('../controllers/ConnectDBController')
const mongoose = require('mongoose')

describe("UserController sign up", () => {
    connectDB(()=>{}).then()
    test('blank signup should cause HTTP 400', async () => {
        const reqBody = {
            username: "",
            password: "",
            confirmPassword: ""
        }
        await setTestCase(reqBody, 400)
    })
    test('missing fields should cause HTTP 400', async () => {
        const testCases = [
            {
                username: "test1",
                password: "",
                confirmPassword: ""
            },
            {
                username: "",
                password: "test1",
                confirmPassword: ""
            },
            {
                username: "",
                password: "",
                confirmPassword: "test1"
            },
            {
                username: "test1",
                password: "test1",
                confirmPassword: ""
            },
            {
                username: "",
                password: "test1",
                confirmPassword: "test1"
            },
            {
                username: "test1",
                password: "",
                confirmPassword: "test1"
            }
        ]
        testCases.forEach((tests) => {
            setTestCase(tests, 400)
        })
    })
    test('invalid username characters should cause HTTP 406', async () => {
        const reqBody = {
            username: "&&&&&&&&&&&",
            password: "badPassword",
            confirmPassword: "badPassword"
        }
        await setTestCase(reqBody, 406)
    })
    test('password confirmed incorrectly should cause HTTP 406', async () => {
        const reqBody = {
            username: "test1",
            password: "badPassword",
            confirmPassword: "goodPassword"
        }
        await setTestCase(reqBody, 406)
    })
    test('password shorter than 8 characters should cause HTTP 400', async () => {
        const reqBody = {
            username: "test1",
            password: "bad",
            confirmPassword: "bad"
        }
        await setTestCase(reqBody, 400)
    })
    test('good signup should cause HTTP 200', async () => {
        const reqBody = {
            username: "test1",
            password: "badPassword",
            confirmPassword: "badPassword"
        }
        await setTestCase(reqBody, 200)
    })

})

async function setTestCase(reqBody, resCode) {
    const req = {
        body: {
            username: reqBody.username,
            password: reqBody.password,
            confirmPassword: reqBody.confirmPassword
        }
    }

    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
    }
    
    await userController.signUp(req, res)
    expect(res.status).toHaveBeenCalledWith(resCode)
}