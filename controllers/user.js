import * as userServices from "../services/user.js";
import asyncHandler from "express-async-handler";
import AppError from "../utils/appError.js";

//get user information
//@route POST api/user/get-user
const getUserInformation = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError("unauthorized user", 401);
  }
  const user = await userServices.getUser(userId);
  if (!user) {
    throw new AppError("user not found", 404);
  }
  res.status(200).json({
    status: "success",
    message: "user founded successfully",
    user,
  });
});

export { getUserInformation };
