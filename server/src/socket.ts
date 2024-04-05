import { Server } from "http";
import { Server as SocketIO } from "socket.io";

const initializeSocketIO = (server: Server) => {
  const io = new SocketIO(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
      credentials: true,
    },
  });

  interface Session {
    drawings: any[];
  }

  const sessions: Record<string, Session> = {};

  io.on("connection", (socket) => {
    socket.on("joinSession", (sessionId, name) => {
      socket.join(sessionId);
      socket.emit("userisJoined", { success: true });
      if (sessions[sessionId]) {
        io.to(socket.id).emit("updateElements", sessions[sessionId].drawings);
      }
      socket
        .to(sessionId)
        .emit("notification", `${name} has joined the session`);
    });

    socket.on("cursor", (sessionId, cursorData) => {
      socket
        .to(sessionId)
        .emit("cursor", { ...cursorData, socketId: socket.id });
    });

    socket.on("draw", (sessionId, data) => {
      if (!sessions[sessionId]) {
        sessions[sessionId] = { drawings: [] };
      }
      const drawData = { ...data, socketId: socket.id };
      sessions[sessionId].drawings.push(drawData);
      io.to(sessionId).emit("updateElements", sessions[sessionId].drawings);
    });

    socket.on("clearCanvas", (sessionId) => {
      if (sessions[sessionId]) {
        sessions[sessionId].drawings = [];
        io.to(sessionId).emit("updateElements", []);
      }
    });

    socket.on("deleteSession", (sessionId) => {
      console.log("sessionDelete");
      if (sessions[sessionId]) {
        delete sessions[sessionId];
        console.log(`session with ${sessionId} deleted successfully`);
      } else {
        console.log(`No session with ${sessionId} was found`);
      }
      io.to(sessionId).emit("sessionDeleted", sessionId);
    });

    socket.on("previousElements", (sessionId, previousElements) => {
      if (!sessions[sessionId]) {
        sessions[sessionId] = { drawings: [] };
      }
      sessions[sessionId].drawings.push(...previousElements);
      io.to(sessionId).emit("updateElements", previousElements);
    });

    socket.on("leaveSession", (sessionId) => {
      socket.leave(sessionId);
      socket.to(sessionId).emit("notification", "A user has left the session");
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("notification", "A user has disconnected");
    });
  });
};

export default initializeSocketIO;
