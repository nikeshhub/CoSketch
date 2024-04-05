import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  import { User } from "./user";
  
  @Entity()
  export class RefreshToken {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    token!: string;
  
    @Column()
    expiryDate!: Date;
  
    @Column()
    userId!: number;
  }
  