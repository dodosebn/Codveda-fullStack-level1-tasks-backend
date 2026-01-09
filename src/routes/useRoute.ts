// src/routes/userRoutes.ts
import { Router, type Response } from "express";
import authenticate, { type AuthenticatedRequest } from "../services/authenticate";

const router = Router();

router.get("/profile", authenticate, async (req, res) => {
  const authReq = req as AuthenticatedRequest; // ✅ Type assertion
  const userId = authReq.user?.id;
  res.json({ userId });
});

export default router;
