import Admin from "../models/adminModel.js";
import * as authServices from "../services/auth.js";

const registerAdmin = async (email, password) => {
  password = await authServices.encryptPassword(password);
  await Admin.create({ email, password });
};
const isAdminEmailExist = async (email) => await Admin.findOne({ email: email });



export { registerAdmin, isAdminEmailExist };
