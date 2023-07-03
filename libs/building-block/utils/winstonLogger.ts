import { NextFunction, Request } from 'express';
import * as winston from 'winston';

class WinstonLogger {
  private static instance: WinstonLogger;
  public infoLog: winston.Logger;
  public warnLog: winston.Logger;
  public errorLog: winston.Logger;

  private constructor(path: string) {
    this.infoLog = winston.createLogger({
      levels: {
        info: 1,
      },
      transports: [
        new winston.transports.File({
          filename: `${path}/info/${new Date().toDateString()}`,
          level: 'info',
        }),
      ],
    });

    this.warnLog = winston.createLogger({
      levels: {
        warn: 2,
      },
      transports: [
        new winston.transports.File({
          filename: `${path}/warn/${new Date().toDateString()}`,
          level: 'warn',
        }),
      ],
    });

    this.errorLog = winston.createLogger({
      levels: {
        error: 3,
      },
      transports: [
        new winston.transports.File({
          filename: `${path}/error/${new Date().toDateString()}`,
          level: 'error',
        }),
      ],
    });
  }

  public static getInstance(path: string): WinstonLogger {
    if (!WinstonLogger.instance) {
      WinstonLogger.instance = new WinstonLogger(path);
    }

    return WinstonLogger.instance;
  }

  public addMeta(meta: any) {
    this.infoLog.defaultMeta = meta;
    this.warnLog.defaultMeta = meta;
    this.errorLog.defaultMeta = meta;
  }
}

export let winstonLogger: WinstonLogger;

export const initWinston = (path: string) => {
  winstonLogger = WinstonLogger.getInstance(path);
};

// Middleware function to add IP to logger
export const addIpMeta = (req: Request, _res: Response, next: NextFunction) => {
  const ip =
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress;

  winstonLogger.addMeta(ip ? { ip } : null);

  next();
};
