// this is src/services/authenticate.ts

import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}


export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded || !decoded.userId) {
      res.status(403).json({ error: "Forbidden: Invalid token" });
      return;
    }

    req.user = {
      id: String(decoded.userId),
    };

    next();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(403).json({ error: "Forbidden: Invalid or expired token" });
  }
};

export default authenticate;
