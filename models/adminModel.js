import { Schema, model } from "mongoose";

const adminSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = model("Admin", adminSchema, "admin");
export default Admin;
