import asyncHandler from "express-async-handler";
import AppError from "../utils/appError.js";
import * as userServices from "../services/user.js";
import * as adminServices from "../services/admin.js";
import * as horseServices from "../services/horse.js";
import * as raceServices from "../services/race.js";
import * as tournamentServices from "../services/tournament.js";
import * as bankServices from "../services/bank.js";
import xlsx from "xlsx";
import { isValidObjectId } from "mongoose";

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
  const { raceDate } = req.body;
  if (!raceDate) {
    return next(new AppError("Date is required", 400));
  }
  const givenDate = new Date(raceDate);
  const isoDate = givenDate.toISOString().slice(0, 10);
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
      await raceServices.addNewRace(race, isoDate);
      allRaces.push(race);
      allTableData.push({ sheetName, data: sheetData });
    }

    res.status(200).json({
      status: "success",
      message: "xlsx data readed successfully",
    });
  } catch (error) {
    console.error(error);
    throw new AppError("Error reading or saving data", 500);
  }
});

//find races based on dates
//@route GET api/admin/races/:date
const getRaces = asyncHandler(async (req, res, next) => {
  const { date } = req.params;
  if (!date) {
    throw new AppError("date must be provided", 400);
  }
  const races = await raceServices.findRacesByDate(date);
  res.status(200).json({
    status: "success",
    races,
  });
});

//create tournaments
//@routes POST api/admin/tournament
const createTournament = asyncHandler(async (req, res, next) => {
  const tournamentsData = req.body;
  if (!tournamentsData) {
    throw new AppError("tournament data is required", 400);
  }

  const newTournament = tournamentServices.prepareTournamentData(tournamentsData);
  const isTournamentExist = await tournamentServices.isTournamentExist(newTournament.name);

  if (isTournamentExist && isTournamentExist.length > 0) {
    throw new AppError("tournament is already exist", 400);
  }
  await tournamentServices.createNewTournament(newTournament);
  res.status(200).json({
    status: "success",
    message: "Tournament created successfully",
  });
});

//get tournament
//@routes GET api/admin/tournaments
const getAllTournaments = asyncHandler(async (req, res, next) => {
  const tournaments = await tournamentServices.findUpcomingTournaments();
  if (!tournaments) {
    return res.status(200).json({
      status: "success",
      message: "There is no available tournament",
      tournaments: [],
    });
  }

  res.status(200).json({
    status: "success",
    message: "tournament available",
    tournaments,
  });
});

//get tournaments based on dates
//@routes GET api/admin/tournaments/:date
const getTournaments = asyncHandler(async (req, res, next) => {
  const { date } = req.params;
  if (!date) {
    throw new AppError("date is not found", 400);
  }
  const tournaments = await tournamentServices.findTournaments(date);
  if (!tournaments) {
    return res.status(200).json({
      status: "success",
      message: "There is no available tournament",
      tournaments: [],
    });
  }
  res.status(200).json({
    status: "success",
    message: "tournament available",
    tournaments,
  });
});

//get tournament information
//@routes GET api/tournaments/:id
const getTournamentInformation = asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  if (!id) {
    throw new AppError("tounament id is required", 400);
  }
  const isValid = isValidObjectId(id);
  if (!isValid) {
    throw new AppError("invalid tournament id", 400);
  }

  const tournament = await tournamentServices.getTournamentDetails(id);
  res.status(200).json({
    status: "success",
    message: "tournament information",
    tournament: tournament ?? [],
  });
});

//findUserDetailsWithBankDetails
//@routes GET api/users/:id
const findUserDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("user id is required", 400);
  }
  const isValid = isValidObjectId(id);
  if (!isValid) {
    throw new AppError("invalid user id", 400);
  }
  const user = await userServices.findUserWithBankDetails(id);

  res.status(200).json({
    status: "success",
    message: "user details",
    user,
  });
});

//change user bank status
//@route PATCH api/admin/user/bank/:bankId/status
const updateUserBankStatus = asyncHandler(async (req, res, next) => {
  let { bankId } = req.params;
  if (!bankId) {
    throw new AppError("bank id is required", 400);
  }
  const bank = await bankServices.findBankDetailsById(bankId);
  if (!bank) {
    throw new AppError("bank details is not found", 400);
  }
  await bankServices.updateBankStatus(bankId, bank?.isAccountVerified);
  res.status(200).json({
    status: "success",
    message: "Bank status updated successfully",
  });
});

//registered users count
//@route GET api/admin/users/count
const registeredUsersCount = asyncHandler(async (req, res, next) => {
  const numberOfRegisterdUsers = await userServices.registeredUsersCount();
  res.status(200).json({
    status: "success",
    numberOfRegisterdUsers,
  });
});

export {
  getAllUsers,
  changeUserStatus,
  readRaceCard,
  getRaces,
  createTournament,
  getAllTournaments,
  getTournaments,
  getTournamentInformation,
  findUserDetails,
  updateUserBankStatus,
  registeredUsersCount,
};
