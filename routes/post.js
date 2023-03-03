const express = require("express");
const route = express.Router();
const postController = require("../controllers/post");
const isAuth = require("../middlewares/is-auth");
const { body, check } = require("express-validator/check");

route.get("/posts", postController.getPosts);

route.post(
  "/post",
  [
    body("title", "Title must have not be empty").isLength({ min: 1 }),
    body("content", "Content must have not be empty").isLength({ min: 1 }),
  ],
  isAuth,
  postController.addPost
);

route.get("/post/:id", postController.getPost);

route.put(
  "/post/:id",
  [
    body("title", "Title must have not be empty").isLength({ min: 1 }),
    body("content", "Content must have not be empty").isLength({ min: 1 }),
  ],
  isAuth,
  postController.editPost
);

route.delete("/post/:id", isAuth, postController.deletePost);

module.exports = route;
