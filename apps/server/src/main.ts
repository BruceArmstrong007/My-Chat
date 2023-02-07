import {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import * as path from 'path';
import { CLIENT_URL, expressRoutes,requestLogger,ServerSocket } from '@server/express';

const app = express();
const httpServer = http.createServer(app);



const socketInstance = new ServerSocket(httpServer);
app.use(helmet());
app.use(express.json())
app.use(cookieParser());
app.use((req: any,res:Response,next:NextFunction)=>{
  req.io = socketInstance.io;
  next();
})

const ROUTES = {
    ASSETS: '/assets',
    API: '/api',
  };

  app.use(cors({
    origin: CLIENT_URL,
    credentials : true,
   }));
  app.use(requestLogger);

app.use(ROUTES.ASSETS, express.static(path.join(__dirname, 'assets')));
app.use(ROUTES.API, expressRoutes);



app.get('/',async(req : Request,res : Response)=> res.status(200).json({success : true, message:'Server is up and running!'}));

const port = process.env.PORT || 3333;



const server = httpServer.listen(port, () => {
console.log(`Listening at http://localhost:${port}/api`);

});

server.on('error', console.error);
