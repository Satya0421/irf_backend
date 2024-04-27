import express from "express";
import * as userController from "../controllers/user.js";
import userAuth from "../middlewares/userAuth.js";

const router = express.Router();

router.get("/get-user", userAuth, userController.getUserInformation);

export default router;
