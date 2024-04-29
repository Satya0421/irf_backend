import User from "../models/userModel.js";
import mongoose from "mongoose";

const findUserByPhone = async (phoneNumber) => await User.findOne({ phoneNumber });

const registerPhone = async (phoneNumber, otp) => await User.create({ phoneNumber, otp });

const registerUser = async (phoneNumber, user) =>
  await User.findOneAndUpdate({ phoneNumber }, user, { new: true });

const findUserByEmail = async (email) => await User.findOne({ email });

const findUserByPanNumber = async (panNumber) => await User.findOne({ panNumber });

const deleteProfileNotCompletedUser = async (phoneNumber) =>
  await User.deleteMany({ phoneNumber, isProfileCompleted: false });

const updateOtp = async (phoneNumber, otp) =>
  await User.findOneAndUpdate({ phoneNumber }, { $set: { otp } }, { new: true });

const findUserByPhoneAndOtp = async (phoneNumber, otp) => await User.findOne({ phoneNumber, otp });

const updateUserStatus = async (phoneNumber, otp) =>
  await User.findOneAndUpdate(
    { phoneNumber, otp },
    { $set: { otp: "undefined", isPhoneNumberVerified: true } },
    { new: true }
  );

const getAllusers = async () =>
  await User.find({ isProfileCompleted: true }).sort({ createdAt: -1 });

const getUser = async (id) =>
  await User.findById({ _id: id }).select(
    "phoneNumber fullName email address panNumber dateOfBirth gender -_id"
  );

const findUserById = async (id) => await User.findById({ _id: id });

const updateBankDetails = async (id, bankId) =>
  await User.findByIdAndUpdate({ _id: id }, { bankDetails: bankId }, { new: true });

export {
  registerPhone,
  findUserByPhone,
  registerUser,
  findUserByEmail,
  findUserByPanNumber,
  deleteProfileNotCompletedUser,
  updateOtp,
  findUserByPhoneAndOtp,
  updateUserStatus,
  getAllusers,
  getUser,
  findUserById,
  updateBankDetails,
};
