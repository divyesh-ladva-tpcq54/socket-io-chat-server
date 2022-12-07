import { Server, Socket } from "socket.io";
import { injectable } from "tsyringe";
import { RoomService } from "../../rooms/room.service";
import { User } from "../../users/user.model";
import { ActiveUserHolder } from "../active-user-holder";
import { SystemMessageHelper } from "../helpers/system-messages.helper";
import { IGroupCreateData } from "../types";

@injectable()
export class GroupCreateHandler {
  constructor(
    private roomService: RoomService,
    private activeUserHolder: ActiveUserHolder,
    private systemMessageHelper: SystemMessageHelper
  ) { }

  public handler = async (io: Server, socket: Socket, currentUser: User, data: IGroupCreateData) => {
    const isRoomAvailable = await this.roomService.findGroupsWithName(data.groupName);
    if (isRoomAvailable) {
      const message = `${data.groupName}: group already exists`;
      const userSockets = this.activeUserHolder.getUserSockets(currentUser.username);
      this.systemMessageHelper.sendGroupSystemMessageToCurrentUser(io, userSockets, message);
      return;
    } 

    const room = await this.roomService.createGroupChatRoom(currentUser.id, data.groupName);
    if (!room) {
      const message = `${data.groupName}: cannot create group, please try again later`;
      const userSockets = this.activeUserHolder.getUserSockets(currentUser.username);
      this.systemMessageHelper.sendGroupSystemMessageToCurrentUser(io, userSockets, message);
      return;
    }

    const message = `${data.groupName}: group created successfully`;
    const userSockets = this.activeUserHolder.getUserSockets(currentUser.username);
    this.systemMessageHelper.sendGroupSystemMessageToCurrentUser(io, userSockets, message);
  }
}
