const { validationResult } = require("express-validator/check");
const Post = require("../models/Post");
const io = require("../socket");

exports.getPosts = (req, res, next) => {
  Post.find()
    .sort({ dateCreate: -1 })
    .then((posts) => {
      return res.send(posts);
    })
    .catch((err) => {
      return res.status(500).send({ message: err.message });
    });
};

exports.getPost = (req, res, next) => {
  const id = req.params.id;
  Post.findById(id).then((post) => {
    const imageUrl = `${req.protocol}://${req.get("host")}/${post.imageUrl}`;
    return res.json({ ...post._doc, imageUrl });
  });
};

exports.addPost = (req, res, next) => {
  const { title, content } = req.body;
  const image = req.file;
  const error = validationResult(req);
  if (!image) {
    return res.status(422).send({ message: "Invalid image file" });
  }
  if (!error.isEmpty()) {
    return res.status(422).send({ message: error.array()[0].msg });
  }

  const newPost = new Post({
    title,
    imageUrl: image.path,
    content,
    dateCreate: new Date(),
    user: { _id: req.session.user._id, name: req.session.user.name },
  });

  return newPost.save().then(() => {
    io.getIO().emit("posts", { action: "create", post: newPost });
    return res.status(201).send({ message: "Add post successfully!" });
  });
};

exports.editPost = (req, res, next) => {
  const id = req.params.id;
  const { title, content } = req.body;
  const image = req.file;

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).send({ message: error.array()[0].msg });
  }

  Post.findById(id).then((post) => {
    post.title = title;
    post.content = content;
    if (image) {
      post.imageUrl = image.path;
    }
    post.save().then((result) => {
      io.getIO().emit("posts", { action: "update", post: post });
      return res.send({ message: "Update successfully!" });
    });
  });
};

exports.deletePost = (req, res, next) => {
  const id = req.params.id;
  Post.findById(id).then((post) => {
    if (post.user._id.toString() != req.session.user._id.toString()) {
      return res.status(401).send({ message: "User do not have right!" });
    } else {
      Post.findByIdAndDelete(id)
        .then((post) => {
          io.getIO().emit("posts", { action: "delete", post: post });
          return res.send({ message: "Deleted Post!" });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};
