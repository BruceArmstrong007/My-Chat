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
        logger.info("StartListeners");

        socket.on("joinChat",async (data:any) => {
            await socket.join(data?.id);
            logger.info(socket?.id+" joined " + data?.id);
        });

        socket.on("leaveChat",async (data:any) => {
            await socket.leave(data?.id);
            logger.info(socket?.id+" left " + data?.id);
        });

        socket.on("message",async(data:any)=>{
            const save = await createMessage({from:data?.from,to:data?.to,message:data?.message});
            await socket.to(data?.id).emit(data?.id,save);
        });



        socket.on("user",async (data:any) => {
          await socket.join(data?.id);
        });

        socket.on("callRequest",async (data:any)=>{
           socket.join(data?.to);
           logger.info(data?.from+" joined room " + data?.to);
           this.io.to(data?.to).emit("call",data);
        });


        socket.on("callResponse",async(data:any)=>{
          this.io.to(data?.to).emit("call",data);
       });

       socket.on("callEnd",async(data:any)=>{
        socket.leave(data?.to);
        logger.info(data?.from+" left room " + data?.to);
       });



        socket.on("error", (res:any) => {
            logger.error(res);
        });

        socket.on("disconnect", () => {
            logger.info(`Client disconnected: ${socket.id}`);
        });
    };

}
