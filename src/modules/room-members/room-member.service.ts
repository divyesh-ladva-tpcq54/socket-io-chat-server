import { injectable } from "tsyringe";
import { RoomMember } from "./room-member.model";
import { RoomMemberRepository } from "./room-member.repository";

@injectable()
export class RoomMemberService {
  constructor(private roomMemberRepository: RoomMemberRepository) { }

  async getRoomMembers(roomId: number): Promise<RoomMember[]> {
    return this.roomMemberRepository.getRoomMembers(roomId);
  }

  async addRoomMember(userId: number, roomId: number): Promise<RoomMember | null> {
    return this.roomMemberRepository.addRoomMember(userId, roomId);
  }
}
