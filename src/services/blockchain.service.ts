// src/services/blockchainService.ts
import axios from "axios";
import { Service } from "typedi";
import { AppDataSource } from "../data-source";
import { Block } from "../entity/Block";
import { Transaction } from "../entity/Transaction";
import { io } from "..";
import { SubscriptionManager } from "./subscriptionManager.service";

@Service()
export class BlockchainService {
    private blockRepository = AppDataSource.getRepository(Block);
    private transactionRepository = AppDataSource.getRepository(Transaction);
    private subscriptionManager = new SubscriptionManager();
    private ethToUsd = 5000; // 1 ETH = $5000

    constructor() {
        this.init();
    }

    private async init() {
        let latestBlock = await this.blockRepository.findOneBy({ id: 1 });
        if (!latestBlock) {
            latestBlock = new Block();
            latestBlock.latestBlockNumber = "0x0"; // initial value
            await this.blockRepository.save(latestBlock);
        }

        this.pollBlockchain();
    }

    private async pollBlockchain() {
        const pollInterval = parseInt(process.env.POLL_INTERVAL || "12000");

        setInterval(async () => {
            try {
                const response = await axios.post(process.env.BLOCKCHAIN_RPC_URL, {
                    jsonrpc: "2.0",
                    method: "eth_blockNumber",
                    params: [],
                    id: 1,
                });

                const latestBlockNumber = response.data.result;
                const storedBlock = await this.blockRepository.findOneBy({ id: 1 });

                if (storedBlock && storedBlock.latestBlockNumber !== latestBlockNumber) {
                    storedBlock.latestBlockNumber = latestBlockNumber;
                    await this.blockRepository.save(storedBlock);

                    await this.fetchBlockDetails(latestBlockNumber);
                }
            } catch (error) {
                console.error("Error polling blockchain:", error);
            }
        }, pollInterval);
    }

    private async fetchBlockDetails(blockNumber: string) {
        try {
            const response = await axios.post(process.env.BLOCKCHAIN_RPC_URL, {
                jsonrpc: "2.0",
                method: "eth_getBlockByNumber",
                params: [blockNumber, true],
                id: 1,
            });

            const blockDetails = response.data.result;
            const transactions = blockDetails.transactions;

            for (const tx of transactions) {
                const transaction = new Transaction();
                transaction.blockNumber = tx.blockNumber;
                transaction.blockHash = tx.blockHash;
                transaction.transactionHash = tx.hash;
                transaction.sender = tx.from;
                transaction.receiver = tx.to;
                transaction.gasPrice = parseInt(tx.gasPrice, 16);
                transaction.value = parseInt(tx.value, 16);

                await this.transactionRepository.save(transaction);

                this.emitTransactionEvents(transaction); // Emit event based on subscription criteria
            }
        } catch (error) {
            console.error("Error fetching block details:", error);
        }
    }

    private emitTransactionEvents(transaction: Transaction) {
        const subscriptions = this.subscriptionManager.getSubscriptions();

        for (const [socketId, subscription] of Object.entries(subscriptions)) {
            const { type, address, range } = subscription;
            let match = false;

            if (type === "all") {
                match = true;
            } else if (type === "sender" && transaction.sender === address) {
                match = true;
            } else if (type === "receiver" && transaction.receiver === address) {
                match = true;
            } else if (type === "address" && (transaction.sender === address || transaction.receiver === address)) {
                match = true;
            } else if (type === "range") {
                const valueInEth = transaction.value / (10 ** 18);
                const valueInUsd = valueInEth * this.ethToUsd;

                switch (range) {
                    case "0-100":
                        if (valueInUsd >= 0 && valueInUsd <= 100) match = true;
                        break;
                    case "100-500":
                        if (valueInUsd > 100 && valueInUsd <= 500) match = true;
                        break;
                    case "500-2000":
                        if (valueInUsd > 500 && valueInUsd <= 2000) match = true;
                        break;
                    case "2000-5000":
                        if (valueInUsd > 2000 && valueInUsd <= 5000) match = true;
                        break;
                    case ">5000":
                        if (valueInUsd > 5000) match = true;
                        break;
                }
            }

            if (match) {
                io.to(socketId).emit("newTransaction", transaction);
            }
        }
    }
}
