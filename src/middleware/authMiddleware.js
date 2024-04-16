const jwt = require('jsonwebtoken');
const { CustomError, ErrorHandler } = require('../utils/responseHandler');
const { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } = require('../constants/error_message_codes');

const verifyToken = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, HTTP_STATUS_MESSAGES.UNAUTHORIZED);
        }

        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, HTTP_STATUS_MESSAGES.UNAUTHORIZED);
        }

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decodedToken.userId;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, HTTP_STATUS_MESSAGES.UNAUTHORIZED);
            } else {
                throw new CustomError(HTTP_STATUS_CODES.UNAUTHORIZED, HTTP_STATUS_MESSAGES.UNAUTHORIZED);
            }
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { verifyToken };
