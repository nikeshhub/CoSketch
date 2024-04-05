import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SessionParticipant } from "./session_participants";

@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  session_name!: string;

  @Column()
  session_code!: string;

  @Column()
  created_by!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @OneToMany(() => SessionParticipant, (participant) => participant.session)
  participants!: SessionParticipant[];
}
