
import type { TokenPayload } from "./auth";
import { Request } from "express";

export interface AuthRequest extends Request {
  user?: TokenPayload;
}
