import { Schema, model } from "mongoose";

const bankSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "bank name is required"],
    },
    accountNumber: {
      type: String,
      unique: true,
      required: [true, "account number is required"],
    },
    ifc: {
      type: String,
      required: [true, "ifc is required"],
    },
    upiId: {
      type: String,
      required: [true, "upi id is required"],
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
export default bankSchema;
