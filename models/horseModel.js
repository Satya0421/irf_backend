import { Schema, model } from "mongoose";

const horseSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    ageColourSex: {
      type: String,
    },
    trainer: {
      type: String,
    },
    jockey: {
      type: String,
    },
    weight: {
      type: Number,
    },
    allowance: {
      type: Number || null,
    },
    rating: {
      type: Number || null,
    },
  },
  {
    timestamps: true,
  }
);

const Horse = model("Horse", horseSchema);
export default Horse;
