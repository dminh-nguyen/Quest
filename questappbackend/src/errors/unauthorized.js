const { StatusCodes } = require("http-status-codes");
const BaseError = require("./base-error");

class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized") {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

module.exports = UnauthorizedError;
