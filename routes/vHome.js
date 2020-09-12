const express = require("express")
const ExpressError = require("../expressError")
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth")

const router = new express.Router()

/** Show homepage */
router.get("/", (req, res, next) => {
    try {
        return res.render("home.html", { user: req.user } )
    } catch (error) {
        return next(error)
    }
})

/** Show registration page */
router.get("/register", (req, res, next) => {
    try {
        return res.render("register.html")
    } catch (error) {
        return next(error)
    }
})

/** Show login page */
router.get("/login", (req, res, next) => {
    try {
        return res.render("login.html")
    } catch (error) {
        return next(error)
    }
})

/** Show All Messages: Don't like how this is named, all original routes should be called "apis" */
router.get("/vMessages", ensureLoggedIn, (req, res, next) => {
    try {
        return res.render("messages.html", { user: req.user } )
    } catch (error) {
        return next(error)
    }
})

/** Show All Messages: Don't like how this is named, all original routes should be called "apis" */
router.get("/vMessages/:id", ensureCorrectUser, (req, res, next) => {
    try {
        return res.render("message_details.html", { user: req.user } )
    } catch (error) {
        return next(error)
    }
})

/** Show All Messages: Don't like how this is named, all original routes should be called "apis" */
router.get("/vMessages/new", ensureLoggedIn, (req, res, next) => {
    try {
        return res.render("message_details.html", { user: req.user })
    } catch (error) {
        return next(error)
    }
})

module.exports = router;