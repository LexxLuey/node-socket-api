// src/entity/Block.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Block {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    latestBlockNumber: string;
}
