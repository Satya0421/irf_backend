import express from "express";
import * as adminController from "../controllers/admin.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

router.get("/get-all-users", adminAuth, adminController.getAllUsers);
router.post("/read-excel", adminController.readExcel);

export default router;
