import {Request,Response,NextFunction} from 'express';
import { TokenPayload, tokenPayloadParser } from '../schema/token.schema';
import { verifyJwt } from '../utils/jwt.utils';

async function verifyToken(req : Request, res : Response, next : NextFunction) {
  
  if (!req.headers.authorization) {
    return res.status(400).json({ success: false, message: 'Unauthorized.' });
  }

  let userPayload: TokenPayload | null = null;
  try {  
    const {decoded,valid, expired, error} = await verifyJwt(req.headers.authorization, process.env.AUTHTOKENSECRET);
    userPayload = tokenPayloadParser.parse(decoded);
    
    if(!valid || expired || !userPayload){
      return res.status(400).json({ success: false, message: error.message });
    }

    res.locals.userPayload = userPayload;
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
  
  next();
}

export default verifyToken;