import * as userServices from "../services/user.js";
import asyncHandler from "express-async-handler";
import AppError from "../utils/appError.js";
import * as bankServices from "../services/bank.js";
import * as tournamentServices from "../services/tournament.js";
import * as services from "../services/services.js";
import * as raceservices from "../services/race.js";
import { isValidObjectId } from "mongoose";

//getUserInformation
//@route POST api/user/get-user
const getUserInformation = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError("unauthorized user", 401);
  }
  const user = await userServices.getUser(userId);

  if (!user) {
    throw new AppError("user not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "user founded successfully",
    user,
  });
});

//addUserBankDetails
//@route POST api/user/add-bank-details
const addUserBankDetails = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const { accountHolderName, bankName, accountNumber, ifscCode, upiId } = req.body;

  if (!userId) {
    throw new AppError("unauthorized user", 401);
  }

  const user = await userServices.findUserById(userId);

  if (!user) {
    throw new AppError("user not found", 404);
  }

  if (!user?.isProfileCompleted) {
    throw new AppError("befor updating bank details,please complete your profile", 400);
  }

  const isAccountNumberExist = await bankServices.isAccountNumberExist(accountNumber);
  const isUpiIdExist = await bankServices.isUpiIdExist(upiId);

  if (user?.bankDetails) {
    const details = await bankServices.findBankDetailsById(user.bankDetails);

    if (isAccountNumberExist && isAccountNumberExist.accountNumber !== details.accountNumber) {
      throw new AppError("account number already exist", 400);
    }

    if (isUpiIdExist && isUpiIdExist.upiId !== details.upiId) {
      throw new AppError("upiId already exist", 400);
    }

    const bankDetails = await bankServices.updateBankDetails(user.bankDetails, {
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
      upiId,
    });
    return res.status(200).json({
      status: "success",
      message: "Bank details updated successfully",
      bankDetails,
    });
  }

  if (isAccountNumberExist) {
    throw new AppError("account number already exist", 400);
  }
  if (isUpiIdExist) {
    throw new AppError("upiId already exist", 400);
  }

  const bankDetails = await bankServices.addBankDetails({
    accountHolderName,
    bankName,
    accountNumber,
    ifscCode,
    upiId,
  });
  await userServices.updateBankDetailsId(userId, bankDetails._id);

  res.status(201).json({
    status: "success",
    message: "Bank details updated successfully",
    bankDetails,
  });
});

//getUserBankDetails
//@route GET api/user/get-bank-details
const getBankDetails = asyncHandler(async (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    throw new AppError("unauthorized user", 401);
  }

  const user = await userServices.findUserById(userId);

  if (!user) {
    throw new AppError("user not found", 404);
  }

  if (!user?.bankDetails) {
    throw new AppError("user bank details not found", 400);
  }

  const bankDetails = await bankServices.findBankDetailsById(user.bankDetails);
  if (!bankDetails) {
    await userServices.deleteBankDetailsId(user.id);
    throw new AppError("bankDetails not found", 404);
  }
  if (!bankDetails?._doc) {
    throw new AppError("bankDetails not found", 404);
  }
  let newBankDetails = bankDetails?._doc;
  newBankDetails = {
    ...newBankDetails,
    panNumber: user?.panNumber,
  };

  res.status(200).json({
    status: "success",
    message: "bank details founded successfully",
    bankDetails: newBankDetails,
  });
});

//getTournamentDetails
//@route GET api/user/tournaments
const getUpcomingTournaments = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError("user not found", 400);
  }
  const tournaments = await tournamentServices.findUpcomingTournaments();
  const updatedTournaments = tournaments.map((tournament) => {
    const { name, ...rest } = tournament._doc;
    const isTournamentRegistered = tournament._doc?.participants.some(
      (tournm) => tournm.participant === userId
    );
    return { ...rest, tournamentName: name, isTournamentRegistered };
  });
  res.status(200).json({
    status: "success",
    tournament: updatedTournaments ?? [],
  });
});

//findRacesByDate
//@route GET api/user/races/:date
const findRacesByDate = asyncHandler(async (req, res, next) => {
  let { date } = req.params;
  if (!date) {
    throw new AppError("date is required", 400);
  }
  const isDateValid = services.isDate(date);
  if (!isDateValid) {
    throw new AppError("invalid date format", 400);
  }
  const races = await raceservices.findRacesByDate(date);
  res.status(200).json({
    status: "success",
    races: races ?? [],
  });
});

//findRaceAvailableDates
//@route GET /api/user/races/dates
const findRaceAvailableDates = asyncHandler(async (req, res, next) => {
  const dates = await raceservices.findRaceAvailableDates();
  res.status(200).json({
    status: "success",
    dates,
  });
});

//addParticipantsToTournament
//@route POST api/user/tournament/:tournamentId/participant
const addParticipantsToTournament = asyncHandler(async (req, res, next) => {
  let { tournamentId } = req.params;
  const userId = req.userId;

  if (!tournamentId || !userId) {
    throw new AppError("Invalid request: tournamentId and userId are required", 400);
  }
  if (!isValidObjectId(tournamentId) || !isValidObjectId(userId)) {
    throw new AppError("Invalid tournamentId or userId", 400);
  }

  const tournament = await tournamentServices.findTournamentById(tournamentId);
  if (!tournament) {
    throw new AppError("Tournament not found or Expired", 404);
  }

  const isAlreadyParticipant = tournament?.participants.some((participant) =>
    participant.equals(userId)
  );

  if (isAlreadyParticipant) {
    throw new AppError("User is already a participant in this tournament", 409);
  }

  const user = await userServices.findUserById(userId);
  if (!user) {
    throw new AppError("User not found", 400);
  }

  if (user.wallet < tournament.entryFee) {
    throw new AppError(
      "you don't have enough money in your wallet to participate in this tournament",
      400
    );
  }

  if (tournament?.numberOfParticipants === tournament?.participants.length) {
    throw new AppError("The tournament has reached its maximum number of participants.", 409);
  }

  await tournamentServices.addParticipantToTournament(tournamentId, userId);
  res.status(200).json({
    status: "success",
    message: "New participant added successfully",
  });
});

export {
  getUserInformation,
  addUserBankDetails,
  getBankDetails,
  getUpcomingTournaments,
  findRacesByDate,
  findRaceAvailableDates,
  addParticipantsToTournament,
};
