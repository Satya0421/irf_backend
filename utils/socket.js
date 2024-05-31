import { verifyToken } from "../services/auth.js";
import AppError from "./appError.js";

//Middleware to authenticate users
const authenticateUser = (socket, next) => {
  const token = socket.handshake.query?.token;
  if (!token) {
    console.log("token not found");
    return next(new AppError("token not found in socket", 401));
  }

  try {
    const token_secret = process.env.JWT_USER_SECRET_KEY;
    const decoded = verifyToken(token, token_secret);
    if (decoded?.payload?.role !== "user") {
      return next(new AppError("unauthorized user", 401));
    }
    socket.decoded = decoded;
    next();
  } catch (error) {
    return next(new AppError("user authorization error  in socket", 401));
  }
};

// Middleware to authenticate admin users
const authenticateAdmin = (socket, next) => {
  const token = socket.handshake.query?.token;
  if (!token) {
    console.log("token not found");
    return next(new AppError("token not found in socket", 401));
  }

  try {
    const token_secret = process.env.JWT_ADMIN_SECRET_KEY;
    const decoded = verifyToken(token, token_secret);
    if (decoded?.payload?.role !== "admin") {
      return next(new AppError("unauthorized admin", 401));
    }
    socket.decoded = decoded;
    next();
  } catch (error) {
    return next(new AppError("admin authorization error  in socket", 401));
  }
};

const socketConfig = (io) => {
  // Helper function to get room member count
  const getRoomMemberCount = (namespace, room) => {
    const roomInfo = io.of(namespace).adapter.rooms.get(room);
    if (roomInfo) {
      console.log(`${namespace} room info:`, roomInfo);
      return roomInfo.size;
    } else {
      console.log(`${namespace} room info is undefined for room: ${room}`);
      return 0;
    }
  };

  //handle connections for the users
  io.use(authenticateUser).on("connection", (socket) => {
    console.log("Common user connected");

    socket.join("userRoom");
    const userCount = getRoomMemberCount("/", "userRoom");
    io.to("userRoom").emit("userCount", userCount);

    socket.on("disconnect", () => {
      socket.leave("userRoom");
      const userCount = getRoomMemberCount("/", "userRoom");
      io.to("userRoom").emit("userCount", userCount);
      console.log("user disconnected");
    });
  });

  //handle connections for the admin namespace
  io.of("/admin")
    .use(authenticateAdmin)
    .on("connection", (socket) => {
      console.log("Admin user connected".bgCyan);

      //create a room for admin users
      socket.join("adminRoom");
      const adminCount = getRoomMemberCount("/admin", "adminRoom");
      io.of("/admin").to("adminRoom").emit("adminCount", adminCount);

      const userCount = getRoomMemberCount("/", "userRoom");
      socket.emit("userCount", userCount);

      // Handle admin messages
      socket.on("adminMessage", (message) => {
        io.of("/admin").to("adminRoom").emit("adminMessage", message);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        socket.leave("adminRoom");
        const adminCount = getRoomMemberCount("/admin", "adminRoom");
        io.of("/admin").to("adminRoom").emit("adminCount", adminCount);
        console.log("Admin user disconnected. Total admins:", adminCount);
      });
    });
};

export default socketConfig;
