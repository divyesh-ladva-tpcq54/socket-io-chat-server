import { Server, Socket } from 'socket.io';
import { singleton } from 'tsyringe';
import { SocketEvents } from './modules/sockets/events';
import { UserService } from './modules/users/user.service';
import { PrivateMessageHandler } from './modules/sockets/handlers/private-message.handler';
import { LogoutHandler } from './modules/sockets/handlers/logout.handler';
import { ActiveUserHolder } from './modules/sockets/active-user-holder';
import { IGroupCreateData, IGroupMemberAddData, IGroupMessageData, IMessagesFullObjectEmit, IPrivateMessageData } from './modules/sockets/types';
import { GroupMessageHandler } from './modules/sockets/handlers/group-message.handler';
import { GroupCreateHandler } from './modules/sockets/handlers/group-create.handler';
import { GroupMemberAddHandler } from './modules/sockets/handlers/group-member-add.handler';
import { ClientDisconnectHandler } from './modules/sockets/handlers/client-disconnect.handler';

@singleton()
export class SocketServer {
  private io: Server;

  constructor(
    private userService: UserService,
    private privateMessageHandler: PrivateMessageHandler,
    private groupMessageHandler: GroupMessageHandler,
    private groupCreateHandler: GroupCreateHandler,
    private groupMemberAddHandler: GroupMemberAddHandler,
    private logoutHandler: LogoutHandler,
    private activeUserHolder: ActiveUserHolder,
    private clientDisconnectHandler: ClientDisconnectHandler,
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
    // TODO add validation
    // this middleware is called only once before connection
    this.io.sockets.use((socket, next) => {

      // call next after validation
      next();
    });

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
              isAdmin: true,
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
            isAdmin: true,
          },
          isForwarded: false,
        }]
      };
      socket.emit(SocketEvents.systemMessage, responseData);

      // TODO: get messages that were sent when the user was offline

      // user logout event
      socket.on(SocketEvents.logout, () => {
        this.logoutHandler.handler(this.io, socket, user.username);
      });

      // private message event
      socket.on(SocketEvents.privateMessage, async (data: IPrivateMessageData) => {
        this.privateMessageHandler.handler(this.io, socket, user, data);
      });

      // group create event 
      socket.on(SocketEvents.groupCreate, async (data: IGroupCreateData) => {
        this.groupCreateHandler.handler(this.io, socket, user, data);
      });

      // group member add event 
      socket.on(SocketEvents.groupMemberAdd, async (data: IGroupMemberAddData) => {
        this.groupMemberAddHandler.handler(this.io, socket, user, data);
      });

      // group member remove event 
      socket.on(SocketEvents.groupMemberRemove, async (data: IGroupMemberAddData) => {
        this.groupMemberAddHandler.handler(this.io, socket, user, data);
      });

      // group message event
      socket.on(SocketEvents.groupMessage, async (data: IGroupMessageData) => {
        this.groupMessageHandler.handler(this.io, socket, user, data);
      });

      // client disconnect event (not logout, but closed one of multiple tabs)
      socket.on(SocketEvents.disconnected, () => {
        this.clientDisconnectHandler.handler(this.io, socket, user);
      })
    })
  }
}
