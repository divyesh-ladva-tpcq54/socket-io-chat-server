import { Server, Socket } from "socket.io";
import { injectable } from "tsyringe";
import { RoomMemberService } from "../../room-members/room-member.service";
import { RoomService } from "../../rooms/room.service";
import { User } from "../../users/user.model";
import { UserService } from "../../users/user.service";
import { ActiveUserHolder } from "../active-user-holder";
import { GroupHelper } from "../helpers/group.helper";
import { SystemMessageHelper } from "../helpers/system-messages.helper";
import { IGroupMemberAddData } from "../types";

@injectable()
export class GroupMemberAddHandler {
  constructor(
    private roomService: RoomService,
    private roomMemberService: RoomMemberService,
    private userService: UserService,
    private groupHelper: GroupHelper,
    private activeUserHolder: ActiveUserHolder,
    private systemMessageHelper: SystemMessageHelper
  ) { }

  public handler = async (io: Server, socket: Socket, currentUser: User, data: IGroupMemberAddData) => {
    const room = await this.roomService.findUserInGroup(currentUser.id, data.groupName);
    if (!room) {
      const message = `${data.groupName}: you need to be a member of this group to add a user`;
      const userSockets = this.activeUserHolder.getUserSockets(currentUser.username);
      this.systemMessageHelper.sendGroupSystemMessageToCurrentUser(io, userSockets, message);
      return;
    }

    const isAdmin = await this.roomService.isUserGroupAdmin(currentUser.id, data.groupName);
    if (!isAdmin) {
      const message = `${data.groupName}: only admins can add new members to this group`;
      const userSockets = this.activeUserHolder.getUserSockets(currentUser.username);
      this.systemMessageHelper.sendGroupSystemMessageToCurrentUser(io, userSockets, message);
      return;
    }

    const otherUser = await this.userService.findOne(data.username);
    if (!otherUser) {
      const message = `${data.username}: user does not exist`;
      const userSockets = this.activeUserHolder.getUserSockets(currentUser.username);
      this.systemMessageHelper.sendGroupSystemMessageToCurrentUser(io, userSockets, message);
      return;
    }


    const otherUserRoom = await this.roomService.findUserInGroup(otherUser.id, room.roomName.name);
    if (otherUserRoom) {
      const message = `${otherUser.username}: already belongs to the group`;
      const userSockets = this.activeUserHolder.getUserSockets(currentUser.username);
      this.systemMessageHelper.sendGroupSystemMessageToCurrentUser(io, userSockets, message);
      return;
    }

    const member = await this.roomMemberService.addRoomMember(otherUser.id, room.id);
    if (!member) {
      const message = `${otherUser.username}: member was not added to the group due to some issue. Please try again later.`;
      const userSockets = this.activeUserHolder.getUserSockets(currentUser.username);
      this.systemMessageHelper.sendGroupSystemMessageToCurrentUser(io, userSockets, message);
      return;
    }

    const userSockets = await this.groupHelper.getRoomMemberSockets(room.id);
    const message = `${otherUser.username} was added to the group ${room.roomName.name} by ${currentUser.username}`;
    this.systemMessageHelper.sendGroupSystemMessageToCurrentUser(io, userSockets, message);
  }
}
