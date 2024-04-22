import User from "../models/userModel.js";

const findUserByPhone = async (phoneNumber) => await User.findOne({ phoneNumber });

const registerUser = async (user) => await User.create(user);

const findUserByEmail = async (email) => await User.findOne({ email });

const findUserByPanNumber = async (panNumber) => await User.findOne({ panNumber });

export { findUserByPhone, registerUser, findUserByEmail, findUserByPanNumber };
