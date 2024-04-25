import asynchHandler from "express-async-handler";
import * as userServices from "../services/user.js";
import * as authService from "../services/auth.js";
import AppError from "../utils/appError.js";
import otpSender from "../utils/api.js";

//send otp to user
//@route POST api/auth/send-otp
const sendOtp = asynchHandler(async (req, res, next) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    throw new AppError("please provide a phone number", 400);
  }
  const isUserExist = await userServices.findUserByPhone(phoneNumber);
  if (isUserExist && !isUserExist?.isProfileCompleted) {
    await userServices.deleteProfileNotCompletedUser(phoneNumber);
  }
  const otp = authService.generateOtp();
  if (isUserExist && isUserExist?.isProfileCompleted) {
    const response = await otpSender({ variables_values: otp, route: "otp", numbers: phoneNumber });
    console.log(response, "response");
    if (!response?.return) {
      return res.status(400).json({
        status: "failed",
        message: "failed to send otp",
      });
    }
    await userServices.updateOtp(phoneNumber, otp);
    return res.status(200).json({
      status: "success",
      message: "otp sent successfully",
    });
  }
  const response = await otpSender({ variables_values: otp, route: "otp", numbers: phoneNumber });
  console.log(response, "response");
  if (!response?.return) {
    return res.status(400).json({
      status: "failed",
      message: "failed to send otp",
    });
  }
  await userServices.registerPhone(phoneNumber, otp);
  res.status(200).json({
    status: "success",
    message: "otp sent successfully",
  });
});

//user verify otp
//@route POST api/auth/verify
const verifyOtp = asynchHandler(async (req, res, next) => {
  const { otp, phoneNumber } = req.body;
  const user = await userServices.findUserByPhone(phoneNumber);
  if (!user) {
    throw new AppError("user not found", 404);
  }
  if (user?.otp !== otp) {
    throw new AppError("invalid otp", 400);
  }
  if (user?.otpExpires < new Date()) {
    throw new AppError("the otp  has expired. please try again.",400);
  }

  await userServices.updateUserStatus(phoneNumber, otp);
  res.status(200).json({
    status: "success",
    message: "user verified",
    isUserNew: !user?.isProfileCompleted,
    isUserBlocked: user?.isBlocked,
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
  if (isPhoneNumberIsExist?.isProfileCompleted) {
    throw new AppError("profile is  already completed ", 409);
  }
  if (!isPhoneNumberIsExist.isPhoneNumberVerified) {
    throw new AppError("user phone number is not Verified", 403);
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
    isVerifiedUser: user?.isVerifiedUser,
  });
});

export { registerUser, sendOtp, verifyOtp };
