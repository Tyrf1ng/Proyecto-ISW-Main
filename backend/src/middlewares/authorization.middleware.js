import jwt from "jsonwebtoken";

const authorize = (authorizedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({ error: "Access denied. No token provided." });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;

      if (!authorizedRoles.includes(req.user.rol)) {
        return res.status(403).send({ error: "Access denied. You do not have the required role." });
      }

      next();
    } catch (ex) {
      res.status(400).send({ error: "Invalid token." });
    }
  };
};

export default authorize;
