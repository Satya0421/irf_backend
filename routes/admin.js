import express from "express";
const router = express.Router();
import * as adminController from "../controllers/admin.js";
import adminAuth from "../middlewares/adminAuth.js";

router.get("/get-all-users", adminAuth, adminController.getAllUsers);

export default router;
