const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const morgan = require("morgan");
const app = express();
const routes = require("./routes/index");

require("dotenv").load(); // loading .env file

mongoose.connect(process.env.URI);
// var url = 'mongodb://localhost:27017/voyage5';
// mongoose.connect(url);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("connected to mongoDB");
});

// Setting up view engine. If decided to use view engine add views to "view" folder.
app.set("view engine", "ejs");

// Setting up CORS
const corsOptions = {
  origin: ["*", "http://localhost:3000"], // List of host authorized make cors request. For cross origin cookies specific host should be given. (ex:"http://localhost:3000")
  credentials: true // Must enable for cross origin cookies.
};
app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../", "build"))); // Serving build version of react app

require("./config/passport");

app.use(
  session({
    secret: process.env.SECRET,
    resave: false, // forces sesseion to be saved even when there was no change
    saveUninitialized: false // forces uninitialized sessions to be saved
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// for using routes
app.use("/api", routes);

/// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

module.exports = app;
