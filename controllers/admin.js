import asyncHandler from "express-async-handler";
import * as userServices from "../services/user.js";
import AppError from "../utils/appError.js";
import * as adminServices from "../services/admin.js";
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
  console.log(req.params);
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
  // Reading the Excel file
  const workbook = xlsx.readFile("./public/race.xlsx");
  // Extracting data from each sheet
  const allTableData = [];
  const allRaces = [];
  workbook.SheetNames.forEach((sheetName) => {
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log(sheetData, sheetName);
    const race = [];
    for (const data of sheetData) {
      race.push({
        horseNmae: data?.HorseName,
        drawBox: data?.DrawBox,
        horseNumber: data?.HorseNumber,
      });
    }
    allRaces.push(race);
    allTableData.push({ sheetName, data: sheetData });
  });
  console.log(allRaces, "all races");

  res.status(200).json({
    status: "success",
    message: "xlsx data readed successfully",
    allTableData,
    allRaces,
  });
});

export { getAllUsers, changeUserStatus, readRaceCard };
