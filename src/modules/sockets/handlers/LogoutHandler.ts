import { Server, Socket } from "socket.io";
import { injectable } from "tsyringe";
import { UserService } from "../../users/user.service";
import { ActiveUserHolder } from "../ActiveUserHolder";
import { SocketEvents } from "../events";

@injectable()
export class LogoutHandler {
  constructor(private userService: UserService, private activeUserHolder: ActiveUserHolder) { }
  
  public handler = async (io: Server, socket: Socket, username: string) => {
    this.activeUserHolder.findAndDeleteAllSockets(username)

    // response with a message
    const responseData = {
      messages: [{
        id: 123,
        message: "Disconnecting user....",
        sender: {
          id: 1,
          username: 'system',
          idAdmin: true,
        },
        isForwarded: false,
      }]
    };
    socket.emit(SocketEvents.forceServerDisconnect, responseData);

    // disconnect user from the socket
    socket.disconnect();
  }
}
