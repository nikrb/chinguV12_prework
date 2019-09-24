//Main route file for each routes

const express = require("express");
const router = express.Router();
const users = require("./users");
const favourites = require("./favourites");

router.use("/users", users);
router.use("/favourites", favourites);
module.exports = router;
