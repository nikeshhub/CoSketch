import express from "express";
import http from "http";
import { Server as SocketIO } from "socket.io";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes";
import { connectDatabase } from "../db/createConnection";
import refreshRouter from "./routes/refreshRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";
import sessionRouter from "./routes/sessionRoutes";
import initializeSocketIO from "./socket";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  })
);

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

initializeSocketIO(server);

connectDatabase()
  .then(() => {
    app.use("/user", userRouter);
    app.use("/refresh", refreshRouter);
    app.use("/session", sessionRouter);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });
