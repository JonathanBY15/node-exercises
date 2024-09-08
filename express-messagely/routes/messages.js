const express = require("express");
const Message = require("../models/message");
const User = require("../models/user");
const ExpressError = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const router = new express.Router();

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in user is either the to or from user.
 */
router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const { id } = req.params;
    const message = await Message.get(id);

    const username = req.user.username;

    // Check if the current user is either the sender or the recipient
    if (message.from_user.username !== username && message.to_user.username !== username) {
      throw new ExpressError("Unauthorized access to this message", 403);
    }

    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 */
router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const { to_username, body } = req.body;
    const from_username = req.user.username;

    // Create a new message
    const message = await Message.create({ from_username, to_username, body });

    return res.status(201).json({ message });
  } catch (err) {
    return next(err);
  }
});

/** POST /:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that only the intended recipient can mark it as read.
 */
router.post("/:id/read", ensureLoggedIn, async function (req, res, next) {
  try {
    const { id } = req.params;
    const message = await Message.get(id);

    const username = req.user.username;

    // Check if the current user is the recipient
    if (message.to_user.username !== username) {
      throw new ExpressError("Only the recipient can mark this message as read", 403);
    }

    // Mark the message as read
    const updatedMessage = await Message.markRead(id);

    return res.json({ message: updatedMessage });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
