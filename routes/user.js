import express from "express";
import * as userController from "../controllers/user.js";
import userAuth from "../middlewares/userAuth.js";
import validation from "../middlewares/validation.js";
import { bankDetailsSchema } from "../validation/bankValidation.js";

const router = express.Router();

router.get("/get-user", userAuth, userController.getUserInformation);
router.post(
  "/add-bank-details",
  userAuth,
  validation(bankDetailsSchema),
  userController.addUserBankDetails
);

export default router;
