import { Schema, model } from "mongoose";

const userSchema = new Schema({
  phoneNumber: {
    type: String,
    required: [true, "phone number is required"],
  },
  fullName: {
    type: String,
    required: [true, "full name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
    required: [true, "gender is required"],
  },
  dateOfBirth: {
    type: String,
    required: [true, "date of birth is required"],
  },
  panNumber: {
    type: String,
    required: [true, "pan number is required"],
  },
  address: {
    type: String,
    required: [true, "address is required"],
  },
  otp:{
    type: String,
  },
  password:{
    type: String,
  }
});

export default model("User", userSchema);
