const express = require("express")
const ExpressError = require("../expressError")
const jwt = require("jsonwebtoken")
const { SECRET_KEY } = require("../config")
const User = require("../models/user")

const router = new express.Router()

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async (req, res, next) => {
    try {
        // Validate username & password provided in request
        const {username, password} = req.body;
        if (!username || !password) {
            throw new ExpressError("Username & Password Required", 400);
        }

        // Validate username & password combination
        const valid = await User.authenticate(username, password);
        if (!valid) {
            throw new ExpressError("Invalid Username/Password", 400);
        }

        // Update user login timestame
        await User.updateLoginTimestamp(username)

        // Return JSON Web Token
        const token = jwt.sign({ username }, SECRET_KEY);
        return res.json({ username, "token": token })
    } catch (error) {
        next(error)
    }
})

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", async (req, res, next) => {
    try {
        // Validate inputs
        const { username, password, first_name, last_name, phone } = req.body;
        if (!username || !password || !first_name || !last_name || !phone) {
            throw new ExpressError("Registration Failed: Missing required information", 400)
        }

        const newUser = await User.register({username, password, first_name, last_name, phone});

        await User.updateLoginTimestamp(newUser.username);

        const token = jwt.sign({ username: newUser.username }, SECRET_KEY);
        return res.json({ username: newUser.username, "token": token })

    } catch (error) {
        if (error.code === '23505') {
            return next(new ExpressError("That username is not available, please try another", 400))
        }
        return next(error)
    }
})

module.exports = router;