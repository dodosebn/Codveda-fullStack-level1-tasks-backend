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
const app_1 = __importDefault(require("./app"));
const db_1 = require("./db");
require("./server/index");
const PORT = process.env.PORT || 3000;
app_1.default.post("/postTodos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }
        const result = yield db_1.pool.query("INSERT INTO todos (title, completed, createdat) VALUES ($1, $2, NOW()) RETURNING *", [title, false]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error("POST /postTodos error:", err);
        res.status(500).json({ error: "Failed to Create todo" });
    }
}));
app_1.default.get("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query("SELECT * FROM todos WHERE id = $1", [
            req.params.id,
        ]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error("GET /todos/:id error:", err);
        res.status(500).json({ error: "Failed to retrieve todo" });
    }
}));
app_1.default.put("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, completed } = req.body;
        const result = yield db_1.pool.query("UPDATE todos SET title = COALESCE($1, title), completed = COALESCE($2, completed) WHERE id = $3 RETURNING *", [title, completed, req.params.id]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Todo not found" });
        }
        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error("PUT /todos/:id error:", err);
        res.status(500).json({ error: "Failed to update todo" });
    }
}));
app_1.default.delete("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query("DELETE FROM todos WHERE id = $1 RETURNING *", [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Todo not found" });
        }
        res.status(200).json({ message: "Todo deleted successfully" });
    }
    catch (err) {
        console.error("DELETE /todos/:id error:", err);
        res.status(500).json({ error: "Failed to delete todo" });
    }
}));
app_1.default.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
