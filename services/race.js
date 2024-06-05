import Race from "../models/raceModel.js";
import { getCurrentDate } from "./services.js";

const addNewRace = async (horses, date) => await Race.create({ date: date, horses });

const findRacesByDate = async (date) => {
  const formattedDate = new Date(date);
  const races = await Race.find({
    date: {
      $gte: formattedDate.setHours(0, 0, 0, 0),
      $lt: formattedDate.setHours(23, 59, 59, 59),
    },
  }).populate("horses.horse");

  return races;
};

const findRaceAvailableDates = async () => {
  const dates = await Race.aggregate([
    {
      $match: { date: { $gte: new Date() } },
    },
    {
      $group: {
        _id: "$date",
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
      },
    },
  ]);
  return dates;
};

const getRaceStatistics = async () => {
  const currentDate = getCurrentDate();
  return await Race.aggregate([
    {
      $facet: {
        totalRaces: [{ $count: "count" }],
        completedRaces: [
          {
            $match: { date: { $lt: new Date(currentDate) } },
          },
          { $count: "count" },
        ],
        upcomingRaces: [
          {
            $match: { date: { $gt: new Date(currentDate) } },
          },
          { $count: "count" },
        ],
        todaysRaces: [
          {
            $match: {
              date: {
                $gte: new Date(currentDate),
                $lt: new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() + 1)),
              },
            },
          },
          { $count: "count" },
        ],
      },
    },
    {
      $project: {
        totalRaces: { $arrayElemAt: ["$totalRaces.count", 0] },
        completedRaces: { $arrayElemAt: ["$completedRaces.count", 0] },
        upcomingRaces: { $arrayElemAt: ["$upcomingRaces.count", 0] },
        todaysRaces: { $arrayElemAt: ["$todaysRaces.count", 0] },
      },
    },
  ]);
};

const getRacesPerMonth = async () => {
  const currentYear = new Date().getFullYear();
  return await Race.aggregate([
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

export { addNewRace, findRacesByDate, findRaceAvailableDates, getRaceStatistics, getRacesPerMonth };
