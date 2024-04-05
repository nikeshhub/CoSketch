import { createConnection } from "typeorm";
import dotenv from "dotenv";
import { User } from "../src/models/user";
import { Session } from "../src/models/session";
import { RefreshToken } from "../src/models/refreshToken";
import { SessionParticipant } from "../src/models/session_participants";

dotenv.config();
console.log(process.env.DB_PASSWORD);

export const connectDatabase = async () => {
  try {
    await createConnection({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      entities: [User, Session, RefreshToken, SessionParticipant],
      name: "default",
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
