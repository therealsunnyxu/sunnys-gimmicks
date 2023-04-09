const userController = require('../controllers/UserController')
const connectDB = require('../controllers/ConnectDBController')
const nodeMocksHTTP = require('node-mocks-http')

describe("UserController sign up", () => {
    beforeAll(() => {
        connectDB.connectToDB()
    })
    test('bad case: blank signup should cause BLANK_FIELDS', async () => {
        const reqBody = {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
        await setTestCase(reqBody, "BLANK_FIELDS", userController.signUp)
    })
    test('bad case: missing fields should cause BLANK_FIELDS', async () => {
        const testCases = [
            {
                username: generateRandomUsername(6),
                email: "",
                password: "",
                confirmPassword: ""
            },
            {
                username: "",
                email: "",
                password: "test1",
                confirmPassword: ""
            },
            {
                username: "",
                email: "",
                password: "",
                confirmPassword: "test1"
            },
            {
                username: generateRandomUsername(6),
                email: "",
                password: "test1",
                confirmPassword: ""
            },
            {
                username: "",
                email: "",
                password: "test1",
                confirmPassword: "test1"
            },
            {
                username: generateRandomUsername(6),
                email: "",
                password: "",
                confirmPassword: "test1"
            }
        ]
        testCases.forEach((tests) => {
            setTestCase(tests, "BLANK_FIELDS", userController.signUp)
        })
    })
    test('bad case: invalid username characters should cause BAD_CHARACTERS', async () => {
        const reqBody = {
            username: "&&&&&&&&&&&",
            email: "badEmail",
            password: "badPassword",
            confirmPassword: "badPassword"
        }
        await setTestCase(reqBody, "BAD_CHARACTERS", userController.signUp)
    })
    test('bad case: disallowed characters in email should cause BAD_EMAIL', async () => {
        const reqBody = {
            username: generateRandomUsername(6),
            email: "BadEmail",
            password: "BadEmail",
            confirmPassword: "BadEmail"
        }
        await setTestCase(reqBody, "BAD_EMAIL", userController.signUp)
    })
    test('bad case: password confirmed incorrectly should cause PW_MISMATCH', async () => {
        const reqBody = {
            username: generateRandomUsername(6),
            email: "badEmail@email.com",
            password: "badPassword",
            confirmPassword: "goodPassword"
        }
        await setTestCase(reqBody, "PW_MISMATCH", userController.signUp)
    })
    test('bad case: password shorter than 8 characters should cause PW_TOO_SHORT', async () => {
        const reqBody = {
            username: generateRandomUsername(6),
            email: "badEmail@email.com",
            password: "bad",
            confirmPassword: "bad"
        }
        await setTestCase(reqBody, "PW_TOO_SHORT", userController.signUp)
    })

    /*
    var randomUsername = generateRandomUsername(6)
    test('good case: good signup should cause SIGN_UP_SUCCESS', async () => {
        const reqBody = {
            username: randomUsername,
            email: "test@email.com",
            password: "badPassword",
            confirmPassword: "badPassword"
        }
        await setTestCase(reqBody, "SIGN_UP_SUCCESS", userController.signUp)
    })

    test('bad case: username already existing should cause USER_ALREADY_EXISTS', async () => {
        const reqBody = {
            username: randomUsername,
            email: "test@email.com",
            password: "badPassword",
            confirmPassword: "badPassword"
        }
        await setTestCase(reqBody, "USER_ALREADY_EXISTS", userController.signUp)
    })
    */
})

describe("UserController log in", () => {
    test('bad case: blank fields should cause BLANK_FIELDS', async () => {
        var reqBody = {
            username: "",
            password: ""
        }
        await setTestCase(reqBody, "BLANK_FIELDS", userController.logIn)
        reqBody = {
            username: generateRandomUsername(6),
            password: ""
        }
        await setTestCase(reqBody, "BLANK_FIELDS", userController.logIn)
        reqBody = {
            username: "",
            password: "BadPassword"
        }
        await setTestCase(reqBody, "BLANK_FIELDS", userController.logIn)
    })
    test('bad case: logging in as a user that doesn\'t exist should cause USER_DOES_NOT_EXIST', async () => {
        const reqBody = {
            username: "DoesNotExist",
            password: "BadPassword"
        }
        await setTestCase(reqBody, "USER_DOES_NOT_EXIST", userController.logIn)
    })
    test('bad case: using the wrong password should cause WRONG_PASSWORD', async () => {
        const testUserReqBody = {
            body: {
                username: "JestTest",
                email: "JestTest@JestTest.com",
                password: "BadPassword",
                confirmPassword: "BadPassword"
            }
        }
        await userController.signUp(testUserReqBody, nodeMocksHTTP.createResponse())

        const reqBody = {
            username: "JestTest",
            password: "WrongPassword"
        }
        await setTestCase(reqBody, "WRONG_PASSWORD", userController.logIn)
    })
    test('good case: using the right password should cause LOG_IN_SUCCESS', async () => {
        const reqBody = {
            username: "JestTest",
            password: "BadPassword"
        }
        await setTestCase(reqBody, "LOG_IN_SUCCESS", userController.logIn)
        await setTestCase(reqBody, "LOG_OUT_SUCCESS", userController.logOut)
    })

    afterAll(() => {
        connectDB.closeConnectionFromDB()
    })
})

async function setTestCase(reqBody, codeWord, testFunction) {
    const request = nodeMocksHTTP.createRequest({
        body: {
            username: reqBody.username,
            email: reqBody.email,
            password: reqBody.password,
            confirmPassword: reqBody.confirmPassword
        }
    })

    var response = nodeMocksHTTP.createResponse()

    await testFunction(request, response)
    const finalResponse = JSON.parse(response._getData())
    expect(finalResponse.code).toBe(codeWord)
}

function generateRandomUsername(numChars) {
    var randomUsername = ""
    for (let i = 0; i < numChars; i++) {
        randomUsername += String.fromCharCode(Math.random() * 26 + 65)
    }
    
    return randomUsername
}