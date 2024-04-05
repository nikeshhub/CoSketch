import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Drawing extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  sessionId!: number;

  @Column()
  userId!: number;

  @Column()
  type!: string;

  @Column("json")
  coordinates!: object;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
