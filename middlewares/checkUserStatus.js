import AppError from "../utils/appError.js";
import { findUserById } from "../services/user.js";

const checkUserStatus = async (req, res, next) => {
  const userId = req?.userId;

  if (!userId) {
    return next(new AppError("user not found", 404));
  }

  try {
    const user = await findUserById(userId);
    if (!user) {
      return next(new AppError("user not found", 404));
    }

    if (user?.isBlocked) {
      return next(new AppError("blocked user", 403));
    }

    next();
  } catch (error) {
    console.error(error);
    throw new AppError("Internal Server Error", 500);
  }
};
export default checkUserStatus;
