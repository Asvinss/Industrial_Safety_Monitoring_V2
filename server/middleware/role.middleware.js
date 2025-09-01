/**
 * Role-based middleware for access control
 * @param {Array} roles - Array of allowed roles
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const hasRole = roles.find(role => req.user.role === role);
    if (!hasRole) {
      return res.status(403).json({ message: 'Access forbidden: Insufficient permissions' });
    }

    next();
  };
};

module.exports = {
  checkRole,
  isAdmin: checkRole(['admin']),
  isManager: checkRole(['admin', 'safety_manager']),
  isSupervisor: checkRole(['admin', 'safety_manager', 'safety_supervisor'])
};