import { Server, Socket } from "socket.io";
import { injectable } from "tsyringe";
import { MessageService } from "../../messages/message.service";
import { RoomMemberService } from "../../room-members/room-member.service";
import { RoomService } from "../../rooms/room.service";
import { User } from "../../users/user.model";
import { ActiveUserHolder } from "../active-user-holder";
import { SocketEvents } from "../events";
import { GroupHelper } from "../helpers/group.helper";
import { IGroupMessageData, IMessagesFullObjectEmit } from "../types";

@injectable()
export class GroupMessageHandler {
  constructor(
    private roomService: RoomService,
    private messageService: MessageService,
    private roomMemberService: RoomMemberService,
    private activeUserHolder: ActiveUserHolder,
    private groupHelper: GroupHelper,
  ) { }

  public handler = async (io: Server, socket: Socket, currentUser: User, data: IGroupMessageData) => {
    try {
      // check if user belongs to any such groups
      const room = await this.roomService.findUserInGroup(currentUser.id, data.groupName);

      if (!room) {        
        // no group found
        return;
      }

      // send message to room
      const message = await this.messageService.sendMessage(room.id, currentUser.id, data.message);

      if (!message) {
        // message was not added
        return;
      }
      const userSockets: string[] = await this.groupHelper.getRoomMemberSockets(room.id);
      const responseData: IMessagesFullObjectEmit = {
        messages: [{
          id: message.id,
          message: data.message,
          sender: {
            id: currentUser.id,
            username: currentUser.username,
            isAdmin: false,
          },
          isForwarded: false,
        }]
      };

      // send to message to all online members
      io.sockets.to(userSockets).emit(SocketEvents.groupMessage, responseData);
    } catch (error) {
      console.log(error);
    }
  }
}
