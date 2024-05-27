// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
    user?: any; 
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: "Failed to authenticate token." });
        }

        req.user = decoded;
        next();
    });
};
