import type { Response } from "express";
import type { AuthenticatedRequest } from "../services/authenticate";
import app from "../app";
import authenticate from "../services/authenticate";

app.get("/profile", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id; 
  res.json({ userId });
});
export default app;