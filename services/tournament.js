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
  const dateAndTime = convertDateTime(datas?.date, datas?.time);
  console.log(dateAndTime);
  return {
    name: datas?.tournamentName.toLowerCase(),
    numberOfParticipants: Number(datas?.numberOfParticipants),
    date: datas?.date,
    time: datas?.time,
    entryFee: Number(datas?.entryFee),
    pricePool: Number(datas?.pricePool),
    dateAndTime,
    races,
  };
}

const createNewTournament = async (tournamentData) => {
  const newTournament = new Tournament(tournamentData);
  return await newTournament.save();
};

const isTournamentExist = async (tournamentName) => {
  return await Tournament.find({ name: tournamentName, dateAndTime: { $gt: new Date() } });
};

const findUpcomingTournaments = async () => {
  return await Tournament.find({ dateAndTime: { $gt: new Date() } })
    .populate("races.race")
    .populate({
      path: "races.race",
      populate: { path: "horses.horse" },
    });
};

const findTournaments = async (date) => {
  return await Tournament.find({ date: date });
};

export {
  createNewTournament,
  prepareTournamentData,
  isTournamentExist,
  findUpcomingTournaments,
  findTournaments,
};
