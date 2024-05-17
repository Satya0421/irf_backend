import express from "express";
import * as adminController from "../controllers/admin.js";
import adminAuth from "../middlewares/adminAuth.js";
import excelUpload from "../utils/multer.js";

const router = express.Router();

router.get("/users", adminAuth, adminController.getAllUsers);
router.patch("/users/:userId/status", adminAuth, adminController.changeUserStatus);
router.post(
  "/read/excel",
  excelUpload.single("excelFile"),
  adminAuth,
  adminController.readRaceCard
);
router.get("/races/:date", adminAuth, adminController.getRaces);
router.post("/tournament", adminAuth, adminController.createTournament);
router.get("/tournaments", adminAuth, adminController.getAllTournaments);
router.get("/tournaments/:date", adminAuth, adminController.getTournaments);
router.get("/tournament/data/:id", adminAuth, adminController.getTournamentInformation);

export default router;
