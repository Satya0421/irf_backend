import { Schema, model } from "mongoose";

const horseSchema = new Schema({
  horse: { type: Schema.Types.ObjectId, ref: "Horse", required: true },
  drawBox: { type: Number },
  horseNumber: { type: Number },
});

const raceSchema = new Schema(
  {
    date: {
      type: Date,
      required: [true, "date is required"],
    },
    horses: [{ type: horseSchema }],
  },
  {
    timestamps: true,
  }
);

const Race = model("Race", raceSchema);
export default Race;
