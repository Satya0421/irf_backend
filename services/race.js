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

export { addNewRace, findRacesByDate };
