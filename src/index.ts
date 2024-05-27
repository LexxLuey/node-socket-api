import { AppDataSource } from "./data-source";
import * as express from "express";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import "reflect-metadata";
import authRoutes from "./routes/auth.routes";
import { Server } from "socket.io";
import { createServer } from "http";
import { Container } from "typedi";
import * as jwt from "jsonwebtoken";
import { BlockchainService } from "./services/blockchain.service";
import { SubscriptionManager } from "./services/subscriptionManager.service";



dotenv.config();

export const app = express();
app.use(express.json());
app.use(express.static("public")); // Serve static files from the "public" directory
// app.use(errorHandler);
const PORT = process.env.APP_PORT || 3000;

app.use('/auth', authRoutes);

app.get("*", (req: Request, res: Response) => {
    res.status(505).json({ message: "Bad Request" });
});

const httpServer = createServer(app);
export const io = new Server(httpServer);

const subscriptionManager = Container.get(SubscriptionManager);

io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error("Authentication error"));
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            return next(new Error("Authentication error"));
        }

        socket.data.user = decoded;
        next();
    });
});

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("subscribe", (subscriptionData) => {
        subscriptionManager.addSubscription(socket.id, subscriptionData);
        console.log("Subscription data:", subscriptionData);
    });

    socket.on("disconnect", () => {
        subscriptionManager.removeSubscription(socket.id);
        console.log("A user disconnected");
    });
});


AppDataSource.initialize()
    .then(async () => {
        Container.get(BlockchainService);
        httpServer.listen(PORT, () => {
            console.log(`We are live baybay!\nServer is running on http://localhost:${PORT}`);
        });
        console.log("Data Source has been initialized!");
    })
    .catch((error) => console.log(error));