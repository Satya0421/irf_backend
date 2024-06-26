import { verifyToken } from "../services/auth.js";
import AppError from "../utils/appError.js";

const adminAuth = (req, res, next) => {
  let token = "";
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("token not found", 401));
  }
  try {
    const token_secret = process.env.JWT_ADMIN_SECRET_KEY;
    const decoded = verifyToken(token, token_secret);
    if (decoded?.payload?.role !== "admin") {
      return next(new AppError("unauthorized user", 404));
    }
    req.adminId = decoded?.payload.adminId;
    next();
  } catch (error) {
    console.log(error?.message);
    throw new AppError(error?.message || "unauthorized user", 401);
  }
};
export default adminAuth;
