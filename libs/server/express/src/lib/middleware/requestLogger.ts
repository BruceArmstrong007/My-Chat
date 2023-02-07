import {Request, Response,NextFunction} from 'express';
import { logger } from '../utils/logger';


export function requestLogger(req:Request,res:Response,next:NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    logger.info(JSON.stringify({
      req: {
        method: req.method,
        url: req.url,
      },
      res: {
        statusCode: res.statusCode,
        responseTime: (Date.now() - start) / 1000,
      },
    }));
  });
  next();
}
