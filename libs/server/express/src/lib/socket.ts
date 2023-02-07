import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import { CLIENT_URL } from './express';
import {createMessage} from './service/message.service';

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

        this.io.on('connection',this.StartListeners);
    }

    StartListeners = (socket: Socket) => {
        console.log('StartListeners');

        socket.on('joinChat',async (data:any) => {
            await socket.join(data?.id);
            console.log(socket?.id+' joined ' + data?.id);
        });

        socket.on('leaveChat',async (data:any) => {
            await socket.leave(data?.id);
            console.log(socket?.id+' left ' + data?.id);
        });

        socket.on('user',async (data:any) => {
            await socket.join(data?.id);
        });


        socket.on("message",async(data:any)=>{
            const save = await createMessage({from:data?.from,to:data?.to,message:data?.message});
            await socket.to(data?.id).emit(data?.id,save);
        });

        socket.on('error', (res:any) => {
            console.info(res);
        });


        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    };

}
