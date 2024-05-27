// src/interfaces/subscription.ts
export interface Subscription {
    type: "all" | "address" | "sender" | "receiver" | "range";
    address?: string;
    range?: "0-100" | "100-500" | "500-2000" | "2000-5000" | ">5000";
}
