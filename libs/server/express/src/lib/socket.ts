import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import {createMessage} from './service/message.service';

export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;

    constructor(server: HttpServer) {
        ServerSocket.instance = this;
        this.io = new Server(server, {
            cors: {
                origin: [process.env.WEB_CLIENT_URL],
                credentials: true
            },
        });
        
        this.io.on('connection',this.StartListeners);
    }

    StartListeners = (socket: Socket) => {
        console.log('StartListeners');
        
        socket.on('join', (data:any) => {
            socket.join(data?.id);
        });
        
        socket.on("message",async(data:any)=>{
            const save = await createMessage({from:data?.from,to:data?.to,message:data?.message});
            this.io.in(data?.id).emit("broadcast",save);
        });

        socket.on('error', (res:any) => {
            console.info(res);
        });
    };

}