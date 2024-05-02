import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import * as authServices from "../services/auth.js";

const registerAdmin = async (email, password) => {
  password = await authServices.encryptPassword(password);
  await Admin.create({ email, password });
};
const isAdminEmailExist = async (email) => await Admin.findOne({ email: email });

const changeUserStatus = async (userId, isBlocked) =>
  await User.findByIdAndUpdate(userId, { $set: { isBlocked: !isBlocked } }, { new: true });

export { registerAdmin, isAdminEmailExist, changeUserStatus };
