const express = require("express");
const router = express.Router();
const User = require("../models/users");
const { check, validationResult } = require("express-validator/check");
//==========================
//======== /api/user/....
//==========================

let loginValidations = [
  check("email").isEmail(),
  check("password").isLength({ min: 4 })
];

let signUpValidation = [
  check("email").isEmail(),
  check("password").isLength({ min: 5 }),
  check("name").isLength({ min: 5, max: 15 })
];

//Route for login:- uses passport local login strategy
router.post("/login", loginValidations, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  //User with provided email check
  try {
    const user = await User.findOne({ "local.email": email });
    const errors = {};
    if (!user) {
      errors.email = "User with provided email does not exist";
      return res.status(404).json(errors);
    }

    if (user.validPassword(password)) {
      //Everything goes right

      //Manually serializing user  in passport session
      req.login(user, err => {
        if (err) {
          return res.status(400).send("Oops some error occured");
        }
        return res
          .status(200)
          .send({ message: "The user is successfully logged in " });
      });
    } else {
      errors.password = "Password incorrect";
      return res.status(400).json(errors);
    }
  } catch (err) {
    console.log(err);
  }
});

//Route for signup:- uses passport local-signup strategy
router.post("/signup", signUpValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ "local.email": email });
    let errors = {};
    if (user) {
      errors = [{ param: "email", msg: "Email already exist" }];
      return res.status(400).json({ errors: errors });
    }

    const newUser = await new User({
      local: {
        name: name,
        email,
        password
      }
    });

    newUser.local.password = newUser.generateHash(password);
    //saving the user
    await newUser.save();
    //Manually serializing user  in passport session
    req.login(newUser, err => {
      if (err) {
        return res.status(400).send("Oops some error occured");
      }
      return res.status(200).send(newUser);
    });
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});

//Route for user logout
router.get("/logout", (req, res) => {
  if (req.user) {
    req.logout();
    req.session.destroy();
    res.clearCookie("connect.sid"); // clean up session info from client-side
    return res.json({ msg: "logging you out" });
  } else {
    return res.json({ msg: "no user to log out!" });
  }
});

module.exports = router;
