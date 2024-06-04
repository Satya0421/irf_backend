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

const getRaceStatistics = async () => {
  return await Race.aggregate([
    {
      $facet: {
        totalRaces: [{ $group: { _id: null, count: { $sum: 1 } } }],
        completedRaces: [
          {
            $group: {
              _id: null,
              count: {
                $sum: {
                  $cond: [{ $lt: ["$date", new Date()] }, 1, 0],
                },
              },
            },
          },
        ],
        upcomingRaces: [
          {
            $group: {
              _id: null,
              count: { $sum: { $cond: [{ $gte: ["$date", new Date()] }, 1, 0] } },
            },
          },
        ],
        todaysRaces: [
          {
            $group: {
              _id: null,
              count: {
                $sum: {
                  $cond: [
                    { $and: [{ $gte: ["$date", new Date()] }, { $lt: ["$date", new Date()] }] },
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
        totalRaces: {
          $arrayElemAt: ["$totalRaces.count", 0],
        },
        completedRaces: {
          $arrayElemAt: ["$completedRaces.count", 0],
        },
        upcomingRaces: {
          $arrayElemAt: ["$upcomingRaces.count", 0],
        },
        todaysRaces: {
          $arrayElemAt: ["$todaysRaces.count", 0],
        },
      },
    },
  ]);
};

export { addNewRace, findRacesByDate, findRaceAvailableDates, getRaceStatistics };
