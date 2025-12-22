import { JwtPayload } from "jsonwebtoken";
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}



declare global {
  namespace Express {
    interface Request {
      deviceInfo?: {
        deviceType: string;
        deviceName: string;
        os: string;
        browser: string;
        ipAddress?: string | null;
      };
    }
  }
}

export {};
