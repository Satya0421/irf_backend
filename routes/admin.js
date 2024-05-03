import express from "express";
import * as adminController from "../controllers/admin.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

router.get("/users", adminAuth, adminController.getAllUsers);
router.patch("/users/:userId/status", adminAuth, adminController.changeUserStatus);
router.post("/read/excel", adminAuth, adminController.readRaceCard);

export default router;
