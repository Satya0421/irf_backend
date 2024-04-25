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
      default: Date.now() + 72000,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerifiedUser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);
export default User;
