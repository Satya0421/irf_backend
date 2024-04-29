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
  const { accountHolderName, bankName, accountNumber, ifc, upiId } = req.body;

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

  const isAccountNumberExist = await bankServices.isAccountNumberExist(accountNumber);
  const isUpiIdExist = await bankServices.isUpiIdExist(upiId);

  if (user?.bankDetails) {
    const details = await bankServices.findBankDetailsById(user.bankDetails);

    if (isAccountNumberExist && isAccountNumberExist.accountNumber !== details.accountNumber) {
      throw new AppError("account number already exist", 400);
    }

    if (isUpiIdExist && isUpiIdExist.upiId !== details.upiId) {
      throw new AppError("upiId already exist", 400);
    }

    const bankDetails = await bankServices.updateBankDetails(user.bankDetails, {
      accountHolderName,
      bankName,
      accountNumber,
      ifc,
      upiId,
    });
    return res.status(200).json({
      status: "success",
      message: "Bank details updated successfully",
      bankDetails,
    });
  }

  if (isAccountNumberExist) {
    throw new AppError("account number already exist", 400);
  }
  if (isUpiIdExist) {
    throw new AppError("upiId already exist", 400);
  }

  const bankDetails = await bankServices.addBankDetails({
    accountHolderName,
    bankName,
    accountNumber,
    ifc,
    upiId,
  });
  await userServices.updateBankDetailsId(userId, bankDetails._id);

  res.status(201).json({
    status: "success",
    message: "Bank details updated successfully",
    bankDetails,
  });
});
export { getUserInformation, addUserBankDetails };
