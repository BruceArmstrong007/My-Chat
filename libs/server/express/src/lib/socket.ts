import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import { CLIENT_URL } from './express';
import {createMessage} from './service/message.service';
import { logger } from './utils/logger';

export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;
    public users : any[] = [];

    public get currentServer(){
        return this.io;
    }

    constructor(server: HttpServer) {
        ServerSocket.instance = this;
        this.io = new Server(server, {
            cors: {
                origin: [CLIENT_URL],
                credentials: true
            },
        });

        this.io.on("connection",this.StartListeners);
    }

    StartListeners = (socket: Socket) => {

        socket.on("user",async (data:any) => {
          await socket.join(data?.roomID);
        });

        socket.on("connectFriend",async (data:any)=>{
          data?.contactIDs.forEach(async(contact:any)=>{
            await socket.join(contact?.roomID);
            logger.info('user '+contact?.id+ ' connected to '+contact?.roomID)
          });
        });

        socket.on("disconnectFriend",async (data:any)=>{
          data?.contactIDs.forEach(async(contact:any)=>{
            await socket.leave(contact?.roomID);
            logger.info('user '+contact?.id+ ' disconnected from '+contact?.roomID)
          });
        });


        socket.on("message",async(data:any)=>{
            const save = await createMessage({from:data?.from, to:data?.to, message:data?.message, type: data?.type});
            socket.to(data?.roomID).emit(data?.roomID,{...data,...save});
        });

        socket.on("videoCall",async (data:any)=>{
          const save = await createMessage({from:data?.from, to:data?.to, message:data?.message, type: data?.type});
          socket.to(data?.roomID).emit("call",{...data,...save});
        });





        socket.on("error", (res:any) => {
            logger.error(res);
        });

        socket.on("disconnect", () => {
            logger.info(`Client disconnected: ${socket.id}`);
        });
    };

}
