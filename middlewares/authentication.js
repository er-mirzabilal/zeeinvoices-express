const { verifyToken } = require("../configs/google-auth");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  verifyToken(token)
    .then((tokenInfo) => {
      if (tokenInfo) {
        req.user = tokenInfo;
        next();
      } else {
        res.status(401).json({ error: "Invalid or expired token" });
      }
    })
    .catch((error) => {
      console.error("Error in auth middleware:", error);
      res.status(500).json({ error: "Internal server error" });
    });
}

module.exports = authMiddleware;
