"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// this is src/server/index.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("../app"));
const db_1 = require("../db");
const useRoute_1 = __importDefault(require("../routes/useRoute"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
app_1.default.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email && !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const result = yield db_1.pool.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email", [email, hashedPassword]);
        const token = jsonwebtoken_1.default.sign({ userId: result.rows[0].id }, JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Signup failed" });
    }
}));
app_1.default.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const result = yield db_1.pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const user = result.rows[0];
        const valid = yield bcryptjs_1.default.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Login failed" });
    }
}));
app_1.default.use("/user", useRoute_1.default);
