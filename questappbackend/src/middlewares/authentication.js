const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) throw new UnauthorizedError("No token, authorization denied");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: payload.userId,
      name: payload.name,
      roles: payload.roles,
    };
    next();
  } catch (error) {
    throw new UnauthorizedError("Token is not valid");
  }
};

module.exports = authMiddleware;
