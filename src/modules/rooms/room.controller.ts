import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { RoomRepository } from "./room.repository";

@injectable()
export class RoomController {
  constructor(private roomRepository: RoomRepository) { }

  public just = async (req: Request, res: Response) => {
    const result = await this.roomRepository.findUserInGroup(1, 'dvs');
    return res.json(result);
  }
}
