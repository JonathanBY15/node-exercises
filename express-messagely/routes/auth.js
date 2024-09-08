const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");
const router = new express.Router();

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 */
router.post("/login", async function (req, res, next) {
  try {
    const { username, password } = req.body;

    // Authenticate user credentials
    const isValid = await User.authenticate(username, password);
    
    if (isValid) {
      // Update last login timestamp
      await User.updateLoginTimestamp(username);

      // Generate token
      const token = jwt.sign({ username }, SECRET_KEY);

      return res.json({ token });
    } else {
      throw new ExpressError("Invalid username/password", 400);
    }
  } catch (err) {
    return next(err);
  }
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", async function (req, res, next) {
  try {
    const { username, password, first_name, last_name, phone } = req.body;

    // Register new user
    const user = await User.register({
      username,
      password,
      first_name,
      last_name,
      phone
    });

    // Update last login timestamp
    await User.updateLoginTimestamp(username);

    // Generate token
    const token = jwt.sign({ username }, SECRET_KEY);

    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
