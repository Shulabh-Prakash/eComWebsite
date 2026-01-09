export const tenantAccess = (req, res, next) => {
  const { tenant } = req.params;

  if (!tenant) {
    return res.status(400).json({ message: "Tenant missing" });
  }

  if (req.user.roles.includes("admin")) {
    return next();
  }

  next();
};
