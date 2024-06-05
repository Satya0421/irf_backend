import Tournament from "../models/tournamentModel.js";
import AppError from "../utils/appError.js";
import { convertDateTime, getCurrentDate } from "./services.js";

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
    })
    .select("-registrationEndDateAndTime -tournamentEndDateAndTime");
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
  return await Tournament.find({ tournamentEndDateAndTime: { $gte: new Date() } })
    .sort({
      createdAt: -1,
    })
    .select("-registrationEndDateAndTime -tournamentEndDateAndTime");
};

const findTournamentById = async (touranmentId) => {
  return await Tournament.findOne({
    _id: touranmentId,
    tournamentEndDateAndTime: { $gt: new Date() },
  });
};

const addParticipantToTournament = async (tournamentId, userId) => {
  await Tournament.findByIdAndUpdate(
    tournamentId,
    { $addToSet: { participants: userId } },
    { new: true }
  );
};

const getTournamentStatistics = async () => {
  const currentDate = getCurrentDate();
  return await Tournament.aggregate([
    {
      $facet: {
        totalTournaments: [{ $group: { _id: null, count: { $sum: 1 } } }],
        completedTournaments: [
          {
            $group: {
              _id: null,
              count: { $sum: { $cond: [{ $lt: ["$date", new Date(currentDate)] }, 1, 0] } },
            },
          },
        ],
        upcomingTournaments: [
          {
            $group: {
              _id: null,
              count: { $sum: { $cond: [{ $gt: ["$date", new Date(currentDate)] }, 1, 0] } },
            },
          },
        ],
        todaysTournaments: [
          {
            $group: {
              _id: null,
              count: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $gte: ["$date", new Date(currentDate)] },
                        {
                          $lt: [
                            "$date",
                            new Date(
                              new Date(currentDate).setDate(new Date(currentDate).getDate() + 1)
                            ),
                          ],
                        },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        totalTournaments: {
          $arrayElemAt: ["$totalTournaments.count", 0],
        },
        completedTournaments: {
          $arrayElemAt: ["$completedTournaments.count", 0],
        },
        upcomingTournaments: {
          $arrayElemAt: ["$upcomingTournaments.count", 0],
        },
        todaysTournaments: {
          $arrayElemAt: ["$todaysTournaments.count", 0],
        },
      },
    },
  ]);
};

const getTournamentsPerMonth = async () => {
  const currentYear = new Date().getFullYear();
  return await Tournament.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(currentYear, 0, 1),
          $lt: new Date(currentYear + 1, 0, 1),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.month": 1 },
    },
  ]);
};

export {
  createNewTournament,
  prepareTournamentData,
  isTournamentExist,
  findUpcomingTournaments,
  findTournaments,
  getTournamentDetails,
  getUpcomingTournaments,
  addParticipantToTournament,
  findTournamentById,
  getTournamentStatistics,
  getTournamentsPerMonth,
};
