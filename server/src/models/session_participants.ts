import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Session } from "./session";

@Entity()
export class SessionParticipant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: string;

  @ManyToOne(() => Session, (session) => session.participants)
  @JoinColumn({ name: "session_id" })
  session!: Session;
}
