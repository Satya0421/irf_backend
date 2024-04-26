import asyncHandler from "express-async-handler";
import * as userServices from "../services/user.js";

//get all user
//@route POST api/admin/get-all-users
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

export { getAllUsers };
