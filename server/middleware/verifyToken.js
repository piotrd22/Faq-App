const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const headers = req.headers.token;

  if (headers) {
    const token = headers.split(" ")[1];

    jwt.verify(token, process.env.SECRET, (error, user) => {
      if (error) {
        res.status(403).json("Token is not valid");
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return res.status(401).json("You are not allowed");
  }
};

module.exports = verifyToken;
