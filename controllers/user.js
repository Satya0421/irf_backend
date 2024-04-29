import * as userServices from "../services/user.js";
import asyncHandler from "express-async-handler";
import AppError from "../utils/appError.js";
import * as bankServices from "../services/bank.js";

//getUserInformation
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

//addUserBankDetails
//@route POST api/user/add-bank-details
const addUserBankDetails = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const { bankName, accountNumber, ifc, upiId } = req.body;

  if (!userId) {
    throw new AppError("unauthorized user", 401);
  }

  const user = await userServices.findUserById(userId);

  if (!user) {
    throw new AppError("user not found", 404);
  }

  if (!user?.isProfileCompleted) {
    throw new AppError("befor updating bank details,please complete your profile", 400);
  }

  if (user.bankDetails) {
    throw new AppError("bank details already added", 400);
  }

  const bankDetails = await bankServices.addBankDetails(bankName, accountNumber, ifc, upiId);
  await userServices.updateBankDetails(userId, bankDetails._id);

  res.status(201).json({
    status: "success",
    message: "Bank details updated successfully",
  });
});
export { getUserInformation, addUserBankDetails };
