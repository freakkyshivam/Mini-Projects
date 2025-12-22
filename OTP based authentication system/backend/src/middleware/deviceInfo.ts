import { UAParser } from "ua-parser-js";
import type { Request, Response, NextFunction } from "express";

export const deviceInfo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
     
    
    const userAgent = req.headers["user-agent"];

    const parser = new UAParser(userAgent);
    const ua = parser.getResult(); 

    const deviceType = ua.device.type || "desktop";

    const deviceName = ua.device.vendor
      ? `${ua.device.vendor} ${ua.device.model ?? ""}`
      : "Unknown Device";

    const os = ua.os.name
      ? `${ua.os.name} ${ua.os.version ?? ""}`
      : "Unknown OS";

    const browser = ua.browser.name
      ? `${ua.browser.name} ${ua.browser.version ?? ""}`
      : "Unknown Browser";

    const ipAddress =
  req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
  req.socket.remoteAddress ||
  null;

  // console.log({deviceType,
  //     deviceName,
  //     os,
  //     browser,
  //     ipAddress,
  //   });
  

    req.deviceInfo = {
      deviceType,
      deviceName,
      os,
      browser,
      ipAddress,
    };

    next();  
  } catch (error) {
    next(error);  
  }
};
