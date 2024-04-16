// constants.js

const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    CONFLICT: 409,
    UNSUPPORTED_MEDIA_TYPE: 415,
    INTERNAL_SERVER_ERROR: 500,
};

const HTTP_STATUS_MESSAGES = {
    OK: 'OK - Request accepted, response contains result.',
    CREATED: 'Created - New resource was created successfully.',
    NO_CONTENT: 'No Content - Request was accepted but nothing to return.',
    BAD_REQUEST: 'Bad Request - The request was not valid.',
    UNAUTHORIZED: 'Unauthorized - Authorization information was missing.',
    FORBIDDEN: 'Forbidden - Client attempted to access a resource without sufficient privileges.',
    NOT_FOUND: 'Not Found - Targeted resource does not exist.',
    METHOD_NOT_ALLOWED: 'Method Not Allowed - Targeted resource does not support the requested HTTP method.',
    NOT_ACCEPTABLE: 'Not Acceptable - Data format requested is not supported by the targeted resource.',
    CONFLICT: 'Conflict - Conflicting change detected during an attempt to modify a resource.',
    UNSUPPORTED_MEDIA_TYPE: 'Unsupported Media Type - Data format of the request body is unsupported.',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
};

module.exports.HTTP_STATUS_CODES = HTTP_STATUS_CODES;
module.exports.HTTP_STATUS_MESSAGES = HTTP_STATUS_MESSAGES;