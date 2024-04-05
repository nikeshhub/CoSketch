import { getRepository } from "typeorm";
import { Session } from "../models/session";
import { SessionParticipant } from "../models/session_participants";
import { ISession } from "../interfaces/session";

export const createSession = async (sessionData: ISession) => {
  const { session_name, session_code, created_by, created_at } = sessionData;
  const sessionRepository = getRepository(Session);

  const session = sessionRepository.create({
    session_name,
    session_code,
    created_by,
    created_at,
  });

  const savedSession = await sessionRepository.save(session);

  return savedSession;
};

export const getSession = (session_code: string) => {
  const sessionRepository = getRepository(Session);
  const session = sessionRepository.findOne({
    where: { session_code: session_code },
  });
  return session;
};

export const deleteSession = async (session_code: string, userId: number) => {
  const sessionRepository = getRepository(Session);
  const session = await sessionRepository.findOne({
    where: { session_code: session_code },
  });

  if (!session) {
    throw new Error("Session not found");
  }
  //only authorize the creator to delete the session
  if (session.created_by !== userId) {
    throw new Error(
      "You are not authorized to stop or delete the session. Please contact the creator to stop this."
    );
  }

  await sessionRepository.remove(session);
  return true;
};
