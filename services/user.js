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
    { $set: { otp: "undefined", isPhoneNumberVerified: true } },
    { new: true }
  );

const getAllusers = async () =>
  await User.find({ isProfileCompleted: true })
    .populate({ path: "bankDetails", select: "isAccountVerified" })
    .sort({ createdAt: -1 });

const getUser = async (id) =>
  await User.findById({ _id: id }).select(
    "phoneNumber fullName email address panNumber dateOfBirth gender -_id wallet"
  );

const findUserById = async (id) => await User.findById({ _id: id });

const updateBankDetailsId = async (id, bankId) =>
  await User.findByIdAndUpdate({ _id: id }, { bankDetails: bankId }, { new: true });

const deleteBankDetailsId = async (id) =>
  await User.findByIdAndUpdate({ _id: id }, { $unset: { bankDetails: 1 } }, { new: true });

const findUserWithBankDetails = async (id) =>
  await User.findById(id).populate({ path: "bankDetails" });

const registeredUsersCount = async () => await User.countDocuments({ isProfileCompleted: true });

const addNewFieldInUser = async () => await User.updateMany({}, { $set: { wallet: 0 } });

const getUsersStatistics = async () =>
  await User.aggregate([
    { $match: { isProfileCompleted: true } },
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: {
            $cond: [{ $eq: ["$isBlocked", false] }, 1, 0],
          },
        },
        blockedUsers: {
          $sum: {
            $cond: [{ $eq: ["$isBlocked", true] }, 1, 0],
          },
        },
      },
    },
  ]);

const getUsersPerMonth = async () => {
  const currentYear = new Date().getFullYear();
  return await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(currentYear, 0, 1),
          $lt: new Date(currentYear + 1, 0, 1),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);
};

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
  updateBankDetailsId,
  deleteBankDetailsId,
  findUserWithBankDetails,
  registeredUsersCount,
  addNewFieldInUser,
  getUsersStatistics,
  getUsersPerMonth,
};
