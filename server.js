import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";
import AppError from "./utils/appError.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import http from "http";
import { Server } from "socket.io";
import socketConfig from "./utils/socket.js";
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:5173", "https://irfadminpanel.onrender.com"],
    methods: ["GET", "POST"],
  },
});

//socket connection configration
socketConfig(io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());

//database connection
connectDB();

//routes setup
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

//catch not founded routes and forwards to error handler
app.all("*", (req, res, next) => {
  next(new AppError("Not found", 404));
});

//error handler
app.use(errorHandler);

//server connection
const PORT = process.env.PORT || 3000;
server.listen(PORT, (err) => {
  if (err) console.log("server connection error".bgRed);
  console.log(`server listening on port ${PORT}`.bgMagenta);
});

//node version v18.16.0
