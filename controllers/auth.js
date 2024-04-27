import asyncHandler from "express-async-handler";
import * as userServices from "../services/user.js";
import * as authService from "../services/auth.js";
import * as adminService from "../services/admin.js";
import AppError from "../utils/appError.js";
import otpSender from "../utils/api.js";

//send otp to user
//@route POST api/auth/send-otp
const sendOtp = asyncHandler(async (req, res, next) => {
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
const verifyOtp = asyncHandler(async (req, res, next) => {
  const { otp, phoneNumber } = req.body;
  const user = await userServices.findUserByPhone(phoneNumber);
  if (!user) {
    throw new AppError("user not found", 404);
  }
  if (user?.otp !== otp) {
    throw new AppError("invalid otp", 400);
  }

  await userServices.updateUserStatus(phoneNumber, otp);
  const token_secret = process.env.JWT_USER_SECRET_KEY;
  const accessToken = authService.generatetoken(
    { userId: user.id, role: "user" },
    token_secret,
    "7d"
  );
  res.status(200).json({
    status: "success",
    message: "user verified",
    isUserNew: !user?.isProfileCompleted,
    isUserBlocked: user?.isBlocked,
    token: accessToken,
    userName: user?.fullName || "",
  });
});

//user register controller
//@route POST api/auth/register
const registerUser = asyncHandler(async (req, res, next) => {
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
  const token_secret = process.env.JWT_USER_SECRET_KEY;
  const accessToken = authService.generatetoken(
    { userId: user.id, role: "user" },
    token_secret,
    "7d"
  );
  res.cookie("refresh_token", accessToken, {
    httpOnly: true, // Prevent client-side access
    secure: true, // Only send over HTTPS (production)
  });
  res.status(200).json({
    status: "success",
    message: "user registred successfully",
    isUserBlocked: user?.isBlocked,
    isUserNew: !user?.isProfileCompleted,
    token: accessToken,
  });
});

//admin login section
//@route POST api/auth/admin/login
const adminLogin = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;
  const isEmailExist = await adminService.isAdminEmailExist(email);
  if (!isEmailExist) {
    throw new AppError("invalid email", 401);
  }
  const isValidUser = await authService.comparePassowrd(password, isEmailExist.password);
  if (!isValidUser) {
    throw new AppError("invalid password", 401);
  }
  const token_secret = process.env.JWT_ADMIN_SECRET_KEY;
  const access_token = authService.generatetoken(
    { adminId: isEmailExist._id, role: "admin" },
    token_secret,
    "7d"
  );
  res.status(200).json({
    status: "success",
    message: "user loged in successfully",
    token: access_token,
  });
});

export { registerUser, sendOtp, verifyOtp, adminLogin };
