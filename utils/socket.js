import { verifyToken } from "../services/auth.js";
import AppError from "./appError.js";

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
      return next(new AppError("unauthorized user", 404));
    }
    socket.decoded = decoded;
    next();
  } catch (error) {
    next(new AppError("admin authorization error  in socket", 401));
  }
};

const socketConfig = (io) => {
  // Helper function to get room member count
  const getRoomMemberCount = (room) => {
    const roomInfo = io.of("/admin").adapter.rooms.get(room);
    console.log(roomInfo);
    return roomInfo ? roomInfo.size : 0;
  };

  //handle connections for the admin namespace
  io.of("/admin")
    .use(authenticateAdmin)
    .on("connection", (socket) => {
      console.log("Admin user connected".bgCyan);

      //create a room for admin users
      socket.join("adminRoom");
      const adminCount = getRoomMemberCount("adminRoom");
      console.log(adminCount);
      io.of("/admin").to("adminRoom").emit("adminCount", adminCount);

      // Handle admin messages
      socket.on("adminMessage", (message) => {
        io.of("/admin").to("adminRoom").emit("adminMessage", message);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        socket.leave("adminRoom");
        const adminCount = getRoomMemberCount("adminRoom");
        io.of("/admin").to("adminRoom").emit("adminCount", adminCount);
        console.log("Admin user disconnected. Total admins:", adminCount);
      });
    });
};

export default socketConfig;
