import { Schema, model } from "mongoose";

const tournamentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    date: {
      type: Date,
      required: [true, "date is required"],
    },
    time: {
      type: String,
      required: [true, "time is required"],
    },
    entryFee: {
      type: Number,
      required: [true, "entry fee is required"],
    },
    pricePool: {
      type: Number,
      required: [true, "price pool is required"],
    },
    numberOfParticipants: {
      type: Number,
      required: [true, "number of participants is required"],
    },
    races: [{ race: { type: Schema.Types.ObjectId, ref: "Race", required: true } }],
    dateAndTime: {
      type: Date,
      required: [true, "date and time is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Tournament = model("Tournament", tournamentSchema);
export default Tournament;
