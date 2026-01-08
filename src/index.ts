import app from "./app";
import { pool } from "./db";
const PORT = process.env.PORT || 3000;
import { Request, Response } from "express";
app.post("/postTodos", async (req: Request, res: Response)=> {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const result = await pool.query(
      "INSERT INTO todos (title, completed, createdat) VALUES ($1, $2, NOW()) RETURNING *",
      [title, false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /postTodos error:", err);
    res.status(500).json({ error: "Failed to Create todo" });
  }
});
app.get("/todos/:id", async (req: Request, res: Response)=> {
  try {
    const result = await pool.query("SELECT * FROM todos WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("GET /todos/:id error:", err);
    res.status(500).json({ error: "Failed to retrieve todo" });
  }
});
app.put("/todos/:id", async (req: Request, res: Response) => {
  try {
    const { title, completed } = req.body;
    const result = await pool.query(
      "UPDATE todos SET title = COALESCE($1, title), completed = COALESCE($2, completed) WHERE id = $3 RETURNING *",
      [title, completed, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Todo not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("PUT /todos/:id error:", err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});
app.delete("/todos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("DELETE /todos/:id error:", err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
