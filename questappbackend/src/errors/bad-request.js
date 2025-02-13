const { StatusCodes } = require("http-status-codes");
const BaseError = require("./base-error");

class BadRequestError extends BaseError {
  constructor(message = "Bad Request") {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

module.exports = BadRequestError;
