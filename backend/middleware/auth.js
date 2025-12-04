import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.header("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token)
    return res
      .status(401)
      .json({ code: "NO_TOKEN", message: "Authorization required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ code: "INVALID_TOKEN", message: "Token invalid or expired" });
  }
};
