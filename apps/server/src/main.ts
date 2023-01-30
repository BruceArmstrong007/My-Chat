import {Request, Response} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import http from 'http';
import * as path from 'path';
import {Server} from 'socket.io';
import { expressRoutes, socket } from '@server/express';

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
  }
  
  interface ClientToServerEvents {
    hello: () => void;
  }
  
  interface InterServerEvents {
    ping: () => void;
  }
  
  interface SocketData {
    name: string;
    age: number;
  }

const app = express();
const httpServer = http.createServer(app);

app.use(express.json())
app.use(cookieParser());

const ROUTES = {
    ASSETS: '/assets',
    API: '/api',
  };
  
  app.use(cors({
    origin: process.env.WEB_CLIENT_URL,
    credentials : true,
   }));

app.use(ROUTES.ASSETS, express.static(path.join(__dirname, 'assets')));
app.use(ROUTES.API, expressRoutes);

 


app.get('/',async(req : Request,res : Response)=> res.status(200).json({success : true, message:'Server is up and running!'}));

const port = process.env.SERVER_PORT || 3333;

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
    cors: {
      origin: process.env.WEB_CLIENT_URL,
      methods: ["GET", "POST","PUT","DELETE","OPTIONS" ],
      allowedHeaders: ["Origin", "X-Api-Key", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
      credentials: true
    },
  });

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);

 socket({ io });
});

server.on('error', console.error);
