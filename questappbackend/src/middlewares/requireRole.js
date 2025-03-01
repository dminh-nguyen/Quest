const ForbiddenError = require("../errors/forbidden");

const requireRole = (allowedRoles = []) => {
  if (typeof allowedRoles === "string") {
    allowedRoles = [allowedRoles];
  }
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      throw new ForbiddenError("No roles assigned");
    }

    const hasPermission = req.user.roles.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasPermission) {
      throw new ForbiddenError("Insufficient permissions");
    }
    next();
  };
};

module.exports = requireRole;
