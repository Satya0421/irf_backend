import Race from "../models/raceModel.js";

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

export { addNewRace, findRacesByDate, findRaceAvailableDates };
