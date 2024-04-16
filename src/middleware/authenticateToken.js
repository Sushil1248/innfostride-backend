const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } = require('../constants/error_message_codes');

const authenticateToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, HTTP_STATUS_MESSAGES.UNAUTHORIZED);
  }

  const token = authorizationHeader.split(' ')[1];
  if (!token) {
    throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, HTTP_STATUS_MESSAGES.UNAUTHORIZED);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, HTTP_STATUS_MESSAGES.UNAUTHORIZED);
    }

    req.user = user; // Attach user information to req
    next();
  });
};

module.exports = authenticateToken;
