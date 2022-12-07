import { Server, Socket } from "socket.io";
import { injectable } from "tsyringe";
import { ActiveUserHolder } from "../active-user-holder";
import { SocketEvents } from "../events";
import { IMessagesFullObjectEmit } from "../types";

@injectable()
export class SystemMessageHelper {
  constructor(private activeUserHolder: ActiveUserHolder) { }

  sendGroupSystemMessageToCurrentUser(io: Server, sockets: string[], message: string) {
    const responseData: IMessagesFullObjectEmit = {
      messages: [{
        id: 123,
        message: message,
        sender: {
          id: 123,
          username: 'system',
          isAdmin: true,
        },
        isForwarded: false,
      }]
    };
  
    // send to error to current user
    io.sockets.to(sockets).emit(SocketEvents.groupMessage, responseData);
  }
}
