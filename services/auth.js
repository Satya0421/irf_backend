import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  return password;
};

const comparePassowrd = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generatetoken = (payload) => {
  const token = jwt.sign({ payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

export { encryptPassword, comparePassowrd, generatetoken, verifyToken };
