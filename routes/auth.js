const express = require("express");
const route = express.Router();
const authController = require("../controllers/auth");
const User = require("../models/User");
const { check, body } = require("express-validator/check");

route.post(
  "/login",
  [
    body("email", "Invalid Email!").isEmail().custom((value, {req})=>{
        return User.findOne({email: value}).then(user=>{
            if (!user){
                throw new Error("User is not Signed up!")
            }
        })
    }),
    body(
      "password",
      "Password must not contain special characters and have at least 5 characters!"
    )
      .isAlphanumeric()
      .isLength({ min: 5 }),
  ],
  authController.postLogin
);
route.post(
  "/sign-up",
  [
    body("email", "Invalid Email!").isEmail(),
    body("email").custom((value, {req}) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          throw new Error("Email is already signed up!");
        }
      });
    }),
    body("name", "Name must have at least 3 characters").isLength({ min: 5 }),
    body(
      "password",
      "Password must not contain special characters and have at least 5 characters!"
    )
      .isAlphanumeric()
      .isLength({ min: 5 }),
  ],
  authController.postSignup
);

route.post("/logout", authController.postLogout);

module.exports = route;
