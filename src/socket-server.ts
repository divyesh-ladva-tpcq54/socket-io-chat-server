import { Server } from 'socket.io';
import { singleton } from 'tsyringe';
import { SocketEvents } from './modules/sockets/events';
import { UserService } from './modules/users/user.service';
import { PrivateMessageHandler } from './modules/sockets/handlers/PrivateMessageHandler';
import { LogoutHandler } from './modules/sockets/handlers/LogoutHandler';
import { ActiveUserHolder } from './modules/sockets/ActiveUserHolder';
import { IGroupMessageData, IMessagesFullObjectEmit, IPrivateMessageData } from './modules/sockets/types';
import { GroupMessageHandler } from './modules/sockets/handlers/GroupMessageHandler';

@singleton()
export class SocketServer {
  private io: Server;

  constructor(
    private userService: UserService,
    private privateMessageHandler: PrivateMessageHandler,
    private groupMessageHandler: GroupMessageHandler,
    private logoutHandler: LogoutHandler,
    private activeUserHolder: ActiveUserHolder
  ) {
    this.io = new Server({
      cors: {
        origin: "*",
      },
    });
    this.registerEvents();
  }

  public getInstance() {
    return this.io;
  }

  private registerEvents() {
    // socket connected
    this.io.sockets.on(SocketEvents.connection, async (socket) => {         
      // check if user exists on server
      const id = socket.handshake.query.userId;
      const user = await this.userService.findOneById(id);

      // user does not exist
      if (!user) {
        const responseData: IMessagesFullObjectEmit = {
          messages: [{
            id: 123,
            message: "User not found, user has been disconnected",
            sender: {
              id: 1,
              username: 'system',
              idAdmin: true,
            },
            isForwarded: false,
          }]
        };

        // disconnect user from the socket
        socket.emit(SocketEvents.forceServerDisconnect, responseData)
        socket.disconnect();
        return;
      }

      // user exists on the system
      // map user to socket id for quick access
      this.activeUserHolder.addUsernameSocket(user.username, socket.id);

      // send connection successfull message
      const welcomeMessage = `${user.username} connected with ${socket.id}`;
      const responseData: IMessagesFullObjectEmit = {
        messages: [{
          id: 123,
          message: welcomeMessage,
          sender: {
            id: 1,
            username: 'system',
            idAdmin: true,
          },
          isForwarded: false,
        }]
      };
      socket.emit(SocketEvents.systemMessage, responseData);

      // get messages that were sent when the user was offline


      // user logout event
      socket.on(SocketEvents.logout, () => {
        this.logoutHandler.handler(this.io, socket, user.username);
      });

      // private message event
      socket.on(SocketEvents.privateMessage, async (data: IPrivateMessageData) => {
        this.privateMessageHandler.handler(this.io, socket, data);
      });

      // group message event
      socket.on(SocketEvents.groupMessage, async (data: IGroupMessageData) => {
        this.groupMessageHandler.handler(this.io, socket, data)
      });

    })
  }
}
