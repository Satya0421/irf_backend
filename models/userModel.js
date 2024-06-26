import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    phoneNumber: {
      type: String,
      unique: true,
    },
    isPhoneNumberVerified: {
      type: Boolean,
      default: false,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
      sparse: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
    dateOfBirth: {
      type: String,
    },
    panNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
      default: Date.now() + 300000,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    bankDetails: {
      type: Schema.Types.ObjectId,
      ref: "Bank",
    },
    kycDetails: {
      type: Schema.Types.ObjectId,
    },
    wallet: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);
export default User;
