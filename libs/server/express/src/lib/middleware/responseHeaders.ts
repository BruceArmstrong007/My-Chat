import {Request, Response, NextFunction} from 'express';
import { CLIENT_URL } from '../express';

export function allowCrossDomain(req : Request, res : Response, next : NextFunction) {
  res.header("Access-Control-Allow-Origin", CLIENT_URL);
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
}
