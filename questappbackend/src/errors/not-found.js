const { StatusCodes } = require("http-status-codes");
const BaseError = require("./base-error");

class NotFoundError extends BaseError {
  constructor(message = "Not Found") {
    super(message, StatusCodes.NOT_FOUND);
  }
}

module.exports = NotFoundError;
