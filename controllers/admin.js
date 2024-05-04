import asyncHandler from "express-async-handler";
import * as userServices from "../services/user.js";
import AppError from "../utils/appError.js";
import * as adminServices from "../services/admin.js";
import * as horseServices from "../services/horse.js";
import * as raceServices from "../services/race.js";
import xlsx from "xlsx";

//get allUser
//@route POST api/admin/users
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await userServices.getAllusers();
  if (!users) {
    return res.status(200).json({
      status: "success",
      message: "there is no users available",
      users: [],
    });
  }
  res.status(200).json({
    satus: "success",
    message: "users are available",
    users,
  });
});

//change user status
//@route PATCH api/admin/users/:userId/status
const changeUserStatus = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await userServices.findUserById(userId);
  if (!user) {
    throw new AppError("User not found", 400);
  }
  await adminServices.changeUserStatus(userId, user?.isBlocked);
  res.status(200).json({
    status: "success",
    message: "User status changed successfully",
  });
});

//read race card
//@route POST api/admin/read/excel
const readRaceCard = asyncHandler(async (req, res, next) => {
  const allTableData = [];
  const allRaces = [];
  if (!req.file || (req.file && !req.file.buffer)) {
    return next(new AppError("No file uploaded!", 400));
  }
  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    for (const sheetName of workbook.SheetNames) {
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      //title validation
      const firstRow = sheetData[0];
      if (!firstRow || !horseServices.validateFieldTitles(firstRow)) {
        return next(
          new AppError(
            `invalid field titles in sheet: ${sheetName} .` +
              "please double-check that the header row names match what we expect.",
            400
          )
        );
      }

      //adding new horses and getting new race details
      const race = await horseServices.processSheetData(sheetData);
      await raceServices.addNewRace(race, Date.now());
      allRaces.push(race);
      allTableData.push({ sheetName, data: sheetData });
    }

    res.status(200).json({
      status: "success",
      message: "xlsx data readed successfully",
      allTableData,
      allRaces,
    });
  } catch (error) {
    console.error(error);
    throw new AppError("Error reading or saving data", 500);
  }
});

export { getAllUsers, changeUserStatus, readRaceCard };
