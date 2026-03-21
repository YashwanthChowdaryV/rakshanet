const allowRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "Authentication required" });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access forbidden: insufficient permissions" });
        }
        
        next();
    };
};

module.exports = { allowRoles };
