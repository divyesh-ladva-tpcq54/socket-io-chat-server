import { injectable } from "tsyringe";
import { User } from "../users/user.model";
import { RoomAdmin } from "./room-admin.model";
import { RoomMember } from "./room-member.model";

@injectable()
export class RoomMemberRepository {
  constructor() { }

  async getRoomMembers(roomId: number) {
    return RoomMember.findAll({
      where: {
        room_id: roomId
      },
      include: [
        {
          model: RoomAdmin,
        },
        {
          model: User,
          attributes: ["id", "username"]
        }
      ]
    })
  }

  async addRoomMember(userId: number, roomId: number): Promise<RoomMember | null> {
    return RoomMember.create({
      room_id: roomId,
      user_id: userId,
    });
  }
}
