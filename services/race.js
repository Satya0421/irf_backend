import Race from "../models/raceModel.js";

const addNewRace = async (horses, date) => await Race.create({ date: date, horses });

export { addNewRace };
