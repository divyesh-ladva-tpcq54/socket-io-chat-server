import { Server, Socket } from "socket.io";
import { injectable } from "tsyringe";
import { MessageService } from "../../messages/message.service";
import { RoomService } from "../../rooms/room.service";
import { User } from "../../users/user.model";
import { UserService } from "../../users/user.service";
import { ActiveUserHolder } from "../ActiveUserHolder";
import { SocketEvents } from "../events";
import { IMessagesFullObjectEmit, IPrivateMessageData } from "../types";

@injectable()
export class PrivateMessageHandler {
  constructor(
    private userService: UserService,
    private roomService: RoomService,
    private messageService: MessageService,
    private activeUserHolder: ActiveUserHolder
  ) { }

  public handler = async (io: Server, socket: Socket, data: IPrivateMessageData) => {
    try {
      // store in database if valid
      const { error, receiverUser, message } = await this.dbOperations(socket, data);
      if (error || !receiverUser) {
        const responseData: IMessagesFullObjectEmit = {
          messages: [{
            id: 123,
            message: error,
            sender: {
              id: 1,
              username: 'system',
              idAdmin: true,
            },
            isForwarded: false,
          }]
        };
  
        // inform sender that user of the error 
        // possible errors
        // 1) user does not exist on the server
        // 2) room cannot be created on the server
        socket.emit(SocketEvents.privateMessage, responseData);
        return;
      }

      if (!this.activeUserHolder.isUserActive(receiverUser.username)) {
        const errorMessage = `Seems user ${receiverUser.username} is offline, we will convey the message after they are online.`
        const responseData: IMessagesFullObjectEmit = {
          messages: [{
            id: 123,
            message: errorMessage,
            sender: {
              id: 1,
              username: 'system',
              idAdmin: true,
            },
            isForwarded: false,
          }]
        };
  
        socket.emit(SocketEvents.privateMessage, responseData);
        return;
      }

      // message successfully added in the database, now need to convey the message to the user
      await this.socketOperations(io, socket, receiverUser, data);
    } catch (error) {
      console.log(error);
    }
  }

  private async socketOperations(io: Server, socket: Socket, receiverUser: User, data: IPrivateMessageData) {

    const responseData: IMessagesFullObjectEmit = {
      messages: [{
        id: 123,
        message: data.message,
        sender: {
          id: data.sender.id,
          username: data.sender.username,
        },
      }]
    };

    // send message to all the sockets of receiver 
    io.sockets.to(this.activeUserHolder.getUserSockets(receiverUser.username)).emit(SocketEvents.privateMessage, responseData);

    // send message to all the sockets of sender also
    io.sockets.to(this.activeUserHolder.getUserSockets(data.sender.username)).emit(SocketEvents.privateMessage, responseData);
  }

  private async dbOperations(socket: Socket, data: IPrivateMessageData) {
    // check if receiver exists on the system 
    const receiverUser = await this.userService.findOne(data.to);

    // if receiver does not exist on the system
    if (!receiverUser) {
      const errorMessage = `${data.to}: no such user exists`;
      return { error: errorMessage };
    }

    // find mutual room
    let room = await this.roomService.findMutualPrivateChatRoom(data.sender.id, receiverUser.id);

    // if private chat does not exist, create a new mutual room
    if (!room) {
      room = await this.roomService.createPrivateChatRoom(data.sender.id, receiverUser.id);
    }
    
    // if still room is not created return error
    if (!room) {
      const errorMessage = "Cannot Create room now, please try again later";
      return { error: errorMessage };
    }

    // add message
    const message = await this.messageService.sendMessage(room.id, data.sender.id, data.message);

    return {
      message, 
      room,
      receiverUser
    }
  }
}
