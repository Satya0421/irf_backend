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
    registrationEndTime: {
      type: String,
      required: [true, "time is required"],
    },
    tournamentEndTime: {
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
    races: [
      {
        race: {
          type: Schema.Types.ObjectId,
          ref: "Race",
          required: true,
        },
      },
    ],
    registrationEndDateAndTime: {
      type: Date,
      required: [true, "date and time is required"],
    },
    tournamentEndDateAndTime: {
      type: Date,
      required: [true, "date and time is required"],
    },
    startingStacks: {
      type: Number,
      required: [true, "starting stack is required"],
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Tournament = model("Tournament", tournamentSchema);
export default Tournament;
