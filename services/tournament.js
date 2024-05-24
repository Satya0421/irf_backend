import Tournament from "../models/tournamentModel.js";
import AppError from "../utils/appError.js";
import { convertDateTime } from "./services.js";

function prepareTournamentData(datas) {
  const races = [];
  if (!datas?.races) {
    throw new AppError("race details not found while creatigning tournament", 400);
  }
  for (const data of datas?.races) {
    races.push({ race: data });
  }
  if (!datas?.date && !datas?.time) {
    throw new AppError("date and time is required", 400);
  }
  const registrationEndDateAndTime = convertDateTime(datas?.date, datas?.registrationEndTime);
  const tournamentEndDateAndTime = convertDateTime(datas?.date, datas?.tournamentEndTime);
  return {
    name: datas?.tournamentName.toLowerCase(),
    numberOfParticipants: Number(datas?.numberOfParticipants),
    date: datas?.date,
    registrationEndTime: datas?.registrationEndTime,
    tournamentEndTime: datas?.tournamentEndTime,
    entryFee: Number(datas?.entryFee),
    pricePool: Number(datas?.pricePool),
    registrationEndDateAndTime,
    tournamentEndDateAndTime,
    startingStacks: Number(datas?.startingStacks),
    races,
  };
}

const createNewTournament = async (tournamentData) => {
  const newTournament = new Tournament(tournamentData);
  return await newTournament.save();
};

const isTournamentExist = async (tournamentName) => {
  return await Tournament.find({
    name: tournamentName,
    tournamentEndDateAndTime: { $gt: new Date() },
  });
};

const findUpcomingTournaments = async () => {
  return await Tournament.find({ tournamentEndDateAndTime: { $gt: new Date() } })
    .sort({ createdAt: -1 })
    .populate("races.race")
    .populate({
      path: "races.race",
      populate: { path: "horses.horse" },
    });
};

const findTournaments = async (date) => {
  return await Tournament.find({ date: date }).sort({ createdAt: -1 });
};

const getTournamentDetails = async (id) => {
  return await Tournament.findOne({ _id: id })
    .populate("races.race")
    .populate({
      path: "races.race",
      populate: { path: "horses.horse" },
    });
};

const getUpcomingTournaments = async () => {
  return await Tournament.find({ tournamentEndDateAndTime: { $gte: new Date() } }).sort({
    createdAt: -1,
  }).select('-registrationEndDateAndTime -tournamentEndDateAndTime');
};

export {
  createNewTournament,
  prepareTournamentData,
  isTournamentExist,
  findUpcomingTournaments,
  findTournaments,
  getTournamentDetails,
  getUpcomingTournaments,
};
