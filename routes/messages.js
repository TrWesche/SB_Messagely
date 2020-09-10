const express = require("express")
const ExpressError = require("../expressError")
const Message = require("../models/message")
const {ensureLoggedIn} = require("../middleware/auth")

const router = new express.Router()

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", ensureLoggedIn, async (req, res, next) => {
    try {
        const {id} = req.params;
        const message = await Message.get(id)

        if (req.user.username === message.to_user.username || req.user.username === message.from_user.username) {
            return res.json({message: message});
        } else {
            throw new ExpressError("Unauthorized", 401)
        }
    } catch (error) {
        return next(error)   
    }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", ensureLoggedIn, async (req, res, next) => {
    try {
        const {to_username, body} = req.body;
        const message = await Message.create({from_username: req.user.username, to_username, body});

        return res.json({message: message})
    } catch (error) {
        return next(error)   
    }
})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", ensureLoggedIn, async (req, res, next) => {
    try {
        const {id} = req.params;
        const message = await Message.get(id)
        if (req.user.username === message.to_user.username) {
            const read_at = await Message.markRead(id)
            return res.json({message: read_at});
        } else {
            throw new ExpressError("Unauthorized", 401)
        }
    } catch (error) {
        return next(error)   
    }
})


module.exports = router;