const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
  if (!token) return res.status(401).json({ message: "Not authorized" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

exports.allow = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden for your role" });
  }
  next();
};
