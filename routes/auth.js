import express from "express";
const router = express.Router();
import * as authController from "../controllers/auth.js";
import validation from "../middlewares/validation.js";
import { sendOtpSchema, otpSchema, userRegisterSchema } from "../validation/authValidation.js";

router.post("/send-otp", validation(sendOtpSchema), authController.sendOtp);
router.post("/verify-otp", validation(otpSchema), authController.verifyOtp);
router.post("/register", validation(userRegisterSchema), authController.registerUser);
export default router;
