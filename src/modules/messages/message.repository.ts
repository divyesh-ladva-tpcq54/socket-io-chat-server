import { Transaction } from "sequelize";
import { injectable } from "tsyringe";
import { DatabaseService } from "../database/database.service";
import { Message } from "./message.model";

@injectable()
export class MessageRepository {
  constructor(private databaseService: DatabaseService) { }

  public async getPrivateMessages(room_id: number): Promise<Message[]> {
    return await Message.findAll({
      where: {
        room_id: room_id
      }
    });
  }

  public async createNewPrivateMessage(roomId: number, senderId: number, message: string): Promise<Message | null> {
    const transaction = async (t: Transaction): Promise<Message> => {
      const createdMessage = await Message.create({
        room_id: roomId,
        user_id: senderId,
        message: message,
      });

      if (!createdMessage) {
        throw new Error("Cannot create Message for now. Please try again later");
      }

      return createdMessage;
    };

    return await this.databaseService.runTransaction<Message>(transaction)
  }
}
