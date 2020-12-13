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

    let payload = jwt.verify(tokenStr, SECRET);
    if (!payload) return new ExpressError('Invalid Token', 401);
    req.username = payload.username;
    req.userid = payload.userid;

    if (payload.username === req.params.username) {
      return next();
    }

    // throw an error, so we catch it in our catch, below
    throw new Error();
  }

  catch (err) {
    const unauthorized = new ExpressError('Unauthorized, invalid token!', 401);
		return next(unauthorized);
  }
}


module.exports = {
  authRequired,
  ensureCorrectUser,
};


// function checkCorrectUser(req, res, next) {
//   if (req.user.username !== req.params.username) {
//     const err = new ExpressError("Unauthorized user", 401);
//     return next(err);
//   }
// else {
//   return next();
// }
// } 