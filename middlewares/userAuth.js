import AppError from "../utils/appError.js";
import { verifyToken } from "../services/auth.js";

const userAuth = (req, res, next) => {
  let token = "";
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    console.log("token not found");
    return next(new AppError("token not found", 401));
  }
  try {
    const token_secret = process.env.JWT_USER_SECRET_KEY;
    const { payload } = verifyToken(token, token_secret);
    if (payload.role !== "user") {
      return next(new AppError("unauthorized user", 404));
    }
    req.userId = payload.userId;
    next();
  } catch (error) {
    console.log(error?.message);
    throw new AppError(error?.message || "unauthorized user", 401);
  }
};
export default userAuth;
