import asynchHandler from "express-async-handler";
import * as userServices from "../services/user.js";
import AppError from "../utils/appError.js";

const registerUser = asynchHandler(async (req, res, next) => {
  let { phoneNumber, fullName, email, gender, dateOfBirth, panNumber, address } = req.body;
  const isPhoneNumberIsExist = await userServices.findUserByPhone(phoneNumber);
  if (isPhoneNumberIsExist) {
    throw new AppError("phone number already used", 409);
  }
  const isEmailIsExist = await userServices.findUserByEmail(email);
  if (isEmailIsExist) {
    throw new AppError("email already Used", 409);
  }
  const isPanNumberIsExist = await userServices.findUserByPanNumber(panNumber);
  if (isPanNumberIsExist) {
    throw new AppError("pan number already Used", 409);
  }

  const user = await userServices.registerUser({
    phoneNumber,
    fullName,
    email,
    gender,
    dateOfBirth,
    panNumber,
    address,
  });
  res.status(201).json({
    status: "success",
    message: "user registred successfully",
  });
});
export { registerUser };
