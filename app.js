/** Express app  */
const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const multer = require('multer');
const path = require('path');
app.use(bodyParser.json()); // app.use(express.json())
app.use(cors());

// add logging system

const morgan = require("morgan");
app.use(morgan("tiny"));

const usersRoutes = require("./routes/users");
const productRoutes = require("./routes/productDetails")
const upcRoutes = require("./routes/upc")
const authRoutes = require("./routes/auth");

app.use("/", authRoutes);
app.use("/api/upc", upcRoutes);
app.use("/users", usersRoutes);
app.use("/product", productRoutes);

//app.use("/images", express.static('/public'));
app.use(express.static(__dirname + 'public'));

  app.get("/public/:file(*)",  async function(req, res, next) {
        try {
        
          let filePath = path.join(__dirname, 'public', req.params.file);
  
            console.log(filePath)
  
            res.sendFile(`${filePath}`)
        } catch (err) {
            return next(err);
        }
        });


/** 404 handler */

app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
  if (err.stack) console.log(err.stack);

  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
