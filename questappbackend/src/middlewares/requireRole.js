const requireRole = (allowedRoles = []) => {
  if (typeof allowedRoles === "string") {
    allowedRoles = [allowedRoles];
  }
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: "Forbidden: no roles assigned" });
    }

    const hasPermission = req.user.roles.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasPermission) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};

module.exports = requireRole;
