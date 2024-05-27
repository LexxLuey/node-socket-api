// src/services/subscriptionManager.ts
import { Service } from "typedi";
import { Subscription } from "../interfaces/subscription.interface";

@Service()
export class SubscriptionManager {
    private subscriptions: { [socketId: string]: Subscription } = {};
    
    addSubscription(socketId: string, subscription: any) {
        this.subscriptions[socketId] = subscription;
    }

    removeSubscription(socketId: string) {
        delete this.subscriptions[socketId];
    }

    getSubscriptions() {
        return this.subscriptions;
    }
}
