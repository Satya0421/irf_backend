import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(uri);
    console.log(`Database connection established:${connect.connection.host}`.cyan.underline);
  } catch (error) {
    console.log("Database connection error", error);
    process.exit(1);
  }
};
export default connectDB;
