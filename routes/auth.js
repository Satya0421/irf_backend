import express from "express";
const router = express.Router();
import * as authController from "../controllers/auth.js";

router.post("/send-otp", authController.sendOtp);
router.post("/register", authController.registerUser);
router.post("/verify-otp", authController.verifyOtp);
export default router;
