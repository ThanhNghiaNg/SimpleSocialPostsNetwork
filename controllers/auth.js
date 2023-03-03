const User = require("../models/User");
const { validationResult } = require("express-validator/check");

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ message: errors.array()[0].msg });
  }
  User.findOne({ email }).then((user) => {
    if (user.password === password) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      return res.send({ message: "Succeffly Login!", token: user._id });
    } else {
      return res.status(422).send({ message: "Password is incorrect!" });
    }
  });
};
exports.postSignup = (req, res, next) => {
  const { email, password, name } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).send({ message: errors.array()[0].msg });
  }

  const newUser = new User({ email, name, password });
  newUser.save().then((user) => {
    return res.status(201).send({ message: "Sign-up Successfully!" });
  });
};
exports.postLogout = (req, res, next) => {};
