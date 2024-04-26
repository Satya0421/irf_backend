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

const generatetoken = (payload, secret, exp) => {
  const token = jwt.sign({ payload }, secret, {
    expiresIn: exp,
  });
  return token;
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

function generateOtp() {
  return Math.floor(Math.random() * 900000) + 100000;
}

export { encryptPassword, comparePassowrd, generatetoken, verifyToken, generateOtp };
