const jwt = require("jsonwebtoken");

const prisma = require("../utils/prisma-client");

const protect = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //Get token from header
    const token = req.headers.authorization.split(" ")[1];
    //Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    //Get user from token
    prisma.user
      .findUnique({
        where: {
          id: decoded.id,
        },
      })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((error) => {
        console.log(error);
        res.status(401);
        next(new Error("Not authorized"));
      });
  } else {
    res.status(401);
    next(new Error("Not authorized"));
  }
};

module.exports = protect;
