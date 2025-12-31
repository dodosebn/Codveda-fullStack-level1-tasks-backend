import { app, pool } from "./task-1-env-setup/main.js";


app.post("/postTodos", async (req, res) => {
  try{
  const { title } = req.body;
if(!title){
  return res.status(400).json({error: "Title is required"});
}
const result = await pool.query(
  "INSERT INTO todos (title, completed, createdat) VALUES ($1, $2, NOW()) RETURNING *",
  [title, false]
);
res.status(201).json(result.rows[0]);
  }catch(err){
    console.error("POST /postTodos error:", err);
    res.status(500).json({error: "Failed to create todo"});
  }
});

app.get("/todos", async (req, res) => {
  try{
    const result = await pool.query(
      "SELECT * FROM todos ORDER BY id ASC"
    );
    res.status(200).json(result.rows);
  }catch(err){
    console.error("GET /todos error:", err);
    res.status(500).json({error: "Failed to fetch todos"});
  }
});

app.get("/todos/:id", async (req, res) => {
  try{
    const result = await pool.query(
      "SELECT * FROM todos WHERE id = $1",
      [req.params.id]
    );
    if(result.rows.length === 0){
      return res.status(404).json({error: "Todo not found"});
    }
    res.status(200).json(result.rows[0]);
  }catch(err){
    console.error("GET /todos/:id error: ", err);
    res.status(500).json({error: "Failed to Fetch todo"});
  }
});

app.put("/todos/:id", async (req, res) => {
  try{
    const {title, completed} = req.body;
    const result = await pool.query(
      "UPDATE todos SET title = COALESCE($1, title), completed = COALESCE($2, completed) WHERE id = $3 RETURNING *",
      [title, completed, req.params.id]
    );
    if(result.rows.length === 0){
      return res.status(400).json({error: "Todo not found"});
    }
    res.status(200).json(result.rows[0]);
  }catch(err){
    console.error("PUT /todos/:id error:", err);
    res.status(500).json({error: "Failed to update todo"});
  }
});

app.delete("/todos/:id", async (req, res) => {
  try{
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if(result.rows.length === 0){
      return res.status(404).json({error: "Todo not found"});
    }
    res.status(200).json({message: "DELETED"});
  }catch(err){
    console.error("DELETE /todos/:id error:", err);
    res.status(500).json({error: "Failed to delete todo"});
  }
});

app.listen(3000, () => {
  console.log("Todo API running on port 3000");
});
