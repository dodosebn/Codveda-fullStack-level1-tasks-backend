"use strict";
// this is src/services/authenticate.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized: No token provided" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!decoded || !decoded.userId) {
            res.status(403).json({ error: "Forbidden: Invalid token" });
            return;
        }
        req.user = {
            id: String(decoded.userId),
        };
        next();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
    catch (error) {
        res.status(403).json({ error: "Forbidden: Invalid or expired token" });
    }
};
exports.default = authenticate;
