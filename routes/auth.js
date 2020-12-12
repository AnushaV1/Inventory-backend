/** Routes for authentication. */
const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const {authRequired} = require("../middleware/auth");

const createToken = require("../helpers/createToken");



router.post("/login", async function(req, res, next) {
  try {
    const user = await User.authenticate(req.body);
    const token = createToken(user);
    return res.json({ token, username: user.username, userid: user.id});
  } catch (e) {
    return next(e);
  }
});

module.exports = router;