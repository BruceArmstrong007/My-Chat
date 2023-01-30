import {Server, Socket} from 'socket.io';
import { findMessages } from './service/message.service';

export const EVENTS = {
    connection: "connection",
    CLIENT: {
      CREATE_ROOM: "CREATE_ROOM",
      SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
      NOTIFICATION: "NOTIFICATION"
    },
  };
  

export function socket({ io }: { io: Server }){

    io.on(EVENTS.connection, (socket: Socket) => {
    
        //  When a user creates a new room
        socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
          socket.join(roomName);
        });
    
        // When a user sends a room message    
        socket.on(
          EVENTS.CLIENT.SEND_ROOM_MESSAGE,
         async ({ roomName, data }) => {
            socket.to(roomName).emit("MESSAGE", data);
            await findMessages({
              OR : [
              {
                  from: {
                  equals : data.user_id
                  },
                  to: {
                  equals : data.contact_id
                  }
              },
              {
              from: {
                  equals : data.contact_id
              },
              to: {
                  equals : data.user_id
              }
              }
          ]
          });
          }
        );

        // user notifications   
        socket.on(
          EVENTS.CLIENT.NOTIFICATION,
          ({ roomName, data }) => {
            socket.to(roomName).emit("NOTIFICATION", data);
          }
        );
      });
}