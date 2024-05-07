import Horse from "../models/horseModel.js";

const isHorseExist = async (horseName) => await Horse.findOne({ name: horseName });

const addNewHorse = async (horseData) => {
  const newHorse = new Horse(horseData);
  return await newHorse.save();
};

function prepareHorseData(data) {
  return {
    name: data?.HorseName,
    ageColourSex: data?.AgeColourSex,
    trainer: data?.Trainer,
    jockey: data?.Jockey,
    weight: data?.Weight,
    allowance: data?.Allowance ? Number(data?.Allowance) : null,
    rating: data?.Rating ? Number(data?.Rating) : null,
  };
}

const processSheetData = async (sheetData) => {
  const race = [];
  for (const data of sheetData) {
    const isHorseExist = await Horse.findOne({ name: data.HorseName });
    if (!isHorseExist) {
      const horseData = prepareHorseData(data);
      const newHorse = new Horse(horseData);
      const horse = await newHorse.save();
      const newRace = {
        horse: horse?._id,
        drawBox: data?.DrawBox,
        horseNumber: data?.HorseNumber,
      };
      race.push(newRace);
    } else {
      const newRace = {
        horse: isHorseExist?._id,
        drawBox: data?.DrawBox,
        horseNumber: data?.HorseNumber,
      };
      race.push(newRace);
    }
  }
  return race;
};

function validateFieldTitles(actualTitles) {
  const expectedSet = new Set([
    "HorseNumber",
    "DrawBox",
    "HorseName",
    "AgeColourSex",
    "Trainer",
    "Jockey",
    "Weight",
    "Allowance",
    "Rating",
  ]);
  const actualSet = new Set(Object.keys(actualTitles));
  return (
    expectedSet.size === actualSet.size && [...expectedSet].every((field) => actualSet.has(field))
  );
}

export { isHorseExist, addNewHorse, processSheetData, validateFieldTitles };
