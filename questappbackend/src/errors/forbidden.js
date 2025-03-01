const { StatusCodes } = require("http-status-codes");
const BaseError = require("./base-error");

class ForbiddenError extends BaseError {
  constructor(message = "Forbidden") {
    super(message, StatusCodes.FORBIDDEN);
  }
}

module.exports = ForbiddenError;
