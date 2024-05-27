// src/entity/Transaction.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sender: string;

    @Column()
    receiver: string;

    @Column()
    blockNumber: number;

    @Column()
    blockHash: string;

    @Column()
    transactionHash: string;

    @Column()
    gasPrice: number;

    @Column()
    value: number;
}
