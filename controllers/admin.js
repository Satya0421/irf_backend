import asyncHandler from "express-async-handler";
import * as userServices from "../services/user.js";
import AppError from "../utils/appError.js";
import * as adminServices from "../services/admin.js";

//get allUser
//@route POST api/admin/users
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await userServices.getAllusers();
  if (!users) {
    return res.status(200).json({
      status: "success",
      message: "there is no users available",
      users: [],
    });
  }
  res.status(200).json({
    satus: "success",
    message: "users are available",
    users,
  });
});

//change user status
//@route PATCH api/admin/change-user-status/${userId}
const changeUserStatus = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  console.log(req.params);
  const user = await userServices.findUserById(userId);
  if (!user) {
    throw new AppError("User not found", 400);
  }
  await adminServices.changeUserStatus(userId, user?.isBlocked);
  res.status(200).json({
    status: "success",
    message: "User status changed successfully",
  });
});

export { getAllUsers, changeUserStatus };
