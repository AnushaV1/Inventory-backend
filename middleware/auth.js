/** Convenience middleware to handle common auth cases in routes. */
const jwt = require("jsonwebtoken");
const {SECRET} = require("../config");
const ExpressError = require("../helpers/expressError");


function authRequired(req, res, next) {
  try {
    const tokenStr = req.body._token || req.query._token;
    let token = jwt.verify(tokenStr, SECRET);
    req.username = token.username;
    req.userid = token.userid;
    return next();
  }

  catch (err) {  
    return next(new ExpressError("You must authenticate first.", 401));
  }
}


function ensureCorrectUser(req, res, next) {
  try {
    const tokenStr = req.body._token || req.query._token;

    let token = jwt.verify(tokenStr, SECRET);
    req.username = token.username;
    req.userid = token.id;

    if (token.username === req.params.username) {
      return next();
    }

    // throw an error, so we catch it in our catch, below
    throw new Error();
  }

  catch (e) {
    const unauthorized = new Error("You are not authorized.");
    unauthorized.status = 401;

    return next(unauthorized);
  }
}


module.exports = {
  authRequired,
  ensureCorrectUser,
};
