import { app, pool } from "./task-1-env-setup/main.js";


app.post("/postTodos", async (req, res) => {
  const { title } = req.body;
  const result = await db.query(
    "INSERT INTO todos (title) VALUES ($1) RETURNING *",
    [title]
  );
  res.status(201).json(result.rows[0]);
});

app.get("/todos", async (req, res) => {
  const result = await db.query("SELECT * FROM todos");
  res.json(result.rows);
});

app.get("/todos/:id", async (req, res) => {
  const result = await db.query("SELECT * FROM todos WHERE id=$1", [
    req.params.id,
  ]);
  res.json(result.rows[0]);
});

app.put("/todos/:id", async (req, res) => {
  const { completed } = req.body;
  await db.query("UPDATE todos SET completed=$1 WHERE id=$2", [
    completed,
    req.params.id,
  ]);
  res.send("UPDATED");
});

app.delete("/todos/:id", async (req, res) => {
  await db.query("DELETE FROM todos WHERE id=$1", [req.params.id]);
  res.send("DELETED");
});

app.listen(3000, () => {
  console.log("Todo API running on port 3000");
});
