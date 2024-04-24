import User from "../models/userModel.js";

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
    { $set: { otp: "undefined", isUserVerified: true } },
    { new: true }
  );

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
};
