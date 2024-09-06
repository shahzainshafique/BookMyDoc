const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).send({ error: "Access Denied! No token provided!" });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: "Invalid Token" });
  }
};
