// responseHandlers.js

class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

class ResponseHandler {
  static success(res, data = null, code=200) {
    res.status(200).json({
      code: code,
      status: 'success',
      data,
    });
  }

  static error(res, statusCode, message, errors = []) {
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      errors,
    });
  }

  static restrict(res, statusCode, message, errors = []) {
    res.status(statusCode).json({
      status: 'restrict',
      statusCode,
      message,
      errors,
    });
  }

  static notFound(res) {
    res.status(404).json({
      status: 'error',
      statusCode: 404,
      message: 'API Route not found!',
    });
  }
}

class ErrorHandler {
  static handleError(err, res) {
    const { statusCode = 500, message } = err;
    ResponseHandler.error(res, statusCode, message);
  }

  static handleNotFound(res) {
    ResponseHandler.notFound(res);
  }

  static handleDatabaseError(err, res) {
    if (err.code === 11000) {
      // Duplicate key error (MongoDB E11000)
      const field = Object.keys(err.keyPattern)[0];
      const value = err.keyValue[field];
      const errorMessage = `${field} "${value}" already exists`;

      ResponseHandler.error(res, 409, 'Record exists with this value', [errorMessage]);
    } else {
      // Other database-related errors
      ResponseHandler.error(res, 500, 'Database error');
    }
  }
}

module.exports = {
  CustomError,
  ErrorHandler,
  ResponseHandler,
};
