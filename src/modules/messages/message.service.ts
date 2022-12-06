import { injectable } from "tsyringe";
import { Message } from "./message.model";
import { MessageRepository } from "./message.repository";

@injectable()
export class MessageService {
  constructor(private messageRepository: MessageRepository) { }

  public async sendMessage(roomId: number, senderId: number, message: string): Promise<Message|null> {
    return await this.messageRepository.createNewPrivateMessage(roomId, senderId, message);
  }
}
