import { injectable } from "tsyringe";
import { RoomService } from "../rooms/room.service";

@injectable()
export class GroupService {
  constructor(private roomService: RoomService) { }

  async getGroupByName(userId: number, groupName: string) {
    //return this.roomService
  }
}
