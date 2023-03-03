module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res
      .status(401)
      .send({ message: "Unauthorized User do not have access!" });
  }
  next();
};
