import { injectable } from "tsyringe";
import { Room } from "./room.model";
import { RoomRepository } from "./room.repository";

@injectable()
export class RoomService {
  constructor(private roomRepository: RoomRepository) { }

  async findMutualPrivateChatRoom(user_id_1: number, user_id_2: number): Promise<Room | null> {
    return await this.roomRepository.findMutualPrivateChatRoom(user_id_1, user_id_2);
  }

  async createPrivateChatRoom(userId_1: number, userId_2: number) {
    return await this.roomRepository.createPrivateChatRoom(userId_1, userId_2);
  }

  async findUserGroupsWithName(userId: number, groupName: string): Promise<Room[]> {
    return this.roomRepository.findUserGroupsByName(userId, groupName);
  }
}
