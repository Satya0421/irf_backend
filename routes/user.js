import express from "express";
import * as userController from "../controllers/user.js";
import userAuth from "../middlewares/userAuth.js";
import validation from "../middlewares/validation.js";
import { bankDetailsSchema } from "../validation/bankValidation.js";
import checkUserStatus from "../middlewares/checkUserStatus.js";

const router = express.Router();

router.get("/get-user", userAuth, checkUserStatus, userController.getUserInformation);
router.post(
  "/add-bank-details",
  userAuth,
  checkUserStatus,
  validation(bankDetailsSchema),
  userController.addUserBankDetails
);
router.get("/get-bank-details", userAuth, checkUserStatus, userController.getBankDetails);
router.get("/tournaments", userAuth, checkUserStatus, userController.getUpcomingTournaments);

export default router;
