import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import * as dotenv from "dotenv";
import { Block } from "./entity/Block";
import { Transaction } from "./entity/Transaction";

dotenv.config()

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } =
    process.env;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: parseInt(DB_PORT || "5432"),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User, Block, Transaction],
    migrations: [__dirname + "/migration/*.ts"],
    subscribers: [],
})
