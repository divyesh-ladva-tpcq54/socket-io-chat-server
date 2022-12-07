import { injectable } from "tsyringe";
import { RoomMemberService } from "../../room-members/room-member.service";
import { ActiveUserHolder } from "../active-user-holder";

@injectable()
export class GroupHelper {
  constructor(private roomMemberService: RoomMemberService, private activeUserHolder: ActiveUserHolder) { }

  async getRoomMemberSockets(roomId: number): Promise<string[]> {
    // get all members from room
    const members = await this.roomMemberService.getRoomMembers(roomId);

    // get active users' socket id
    const roomMemberUsernames = members.map((member) => member.user.username);      

    let userSockets: string[] = [];
    for (const username of roomMemberUsernames) {
      userSockets.push(...this.activeUserHolder.getUserSockets(username));
    }

    return userSockets;
  }
}
