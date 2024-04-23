import asynchHandler from "express-async-handler";
import * as userServices from "../services/user.js";
import * as authService from "../services/auth.js";
import AppError from "../utils/appError.js";

//send otp to user
//@route POST api/auth/send-otp
const sendOtp = asynchHandler(async (req, res, next) => {
  const { phoneNumber } = req.body;
  const isUserExist = await userServices.findUserByPhone(phoneNumber);
  console.log(isUserExist);
  req.session.phoneNumber = phoneNumber;
  console.log(req.session.phoneNumber, "phone");
  if (isUserExist && !isUserExist?.isProfileCompleted) {
    await userServices.deleteProfileNotCompletedUser(phoneNumber);
  }
  if (isUserExist && isUserExist?.isProfileCompleted) {
    const otp = authService.generateOtp();
    await userServices.updateOtp(phoneNumber, otp);
    return res.status(200).json({
      status: "success",
      message: "otp changed successfully",
    });
  }
  const otp = authService.generateOtp();
  const user = await userServices.registerPhone(phoneNumber, otp);

  res.status(200).json({
    status: "success",
    message: "otp sent successfully",
  });
});

//user verify otp
//@route POST api/auth/verify
const verifyOtp = asynchHandler(async (req, res, next) => {
  const phoneNumber = req.session.phoneNumber;
  console.log(phoneNumber);
  const { otp } = req.body;
  const user = await userServices.findUserByPhone(phoneNumber);
  if (!user) {
    throw new AppError("user not found", 404);
  }
  if (user?.otp !== otp) {
    throw new AppError("invalid otp", 400);
  }
  res.status(200).json({
    status: "success",
    message: "user verified",
    isNewUser: !user?.isProfileCompleted,
  });
});

//user register controller
//@route POST api/auth/register
const registerUser = asynchHandler(async (req, res, next) => {
  let { phoneNumber, fullName, email, gender, dateOfBirth, panNumber, address } = req.body;
  const isPhoneNumberIsExist = await userServices.findUserByPhone(phoneNumber);
  if (!isPhoneNumberIsExist) {
    throw new AppError("phone number is not found", 404);
  }
  if (isPhoneNumberIsExist && isPhoneNumberIsExist?.isProfileCompleted) {
    throw new AppError("profile is  already completed ", 409);
  }
  const isEmailIsExist = await userServices.findUserByEmail(email);
  if (isEmailIsExist) {
    throw new AppError("email already Used", 409);
  }
  const isPanNumberIsExist = await userServices.findUserByPanNumber(panNumber);
  if (isPanNumberIsExist) {
    throw new AppError("pan number already Used", 409);
  }

  const user = await userServices.registerUser(phoneNumber, {
    fullName,
    email,
    gender,
    dateOfBirth,
    panNumber,
    address,
    isProfileCompleted: true,
  });
  const token_secret = process.env.JWT_SECRET_KEY;
  const accessToken = authService.generatetoken(
    { userId: user.id, role: "user", phoneNumber: user.phoneNumber },
    token_secret
  );
  res.cookie("refresh_token", accessToken, {
    httpOnly: true, // Prevent client-side access
    secure: true, // Only send over HTTPS (production)
  });
  res.status(201).json({
    status: "success",
    message: "user registred successfully",
  });
});

export { registerUser, sendOtp, verifyOtp };
