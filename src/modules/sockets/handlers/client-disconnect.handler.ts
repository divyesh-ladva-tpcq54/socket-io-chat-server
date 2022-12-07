import { Server, Socket } from "socket.io";
import { injectable } from "tsyringe";
import { User } from "../../users/user.model";
import { ActiveUserHolder } from "../active-user-holder";

@injectable()
export class ClientDisconnectHandler {
  constructor(private activeUserHolder: ActiveUserHolder) { }

  public handler = (io: Server, socket: Socket, user: User) => {
    this.activeUserHolder.findAndDeleteSingleSocket(user.username, socket.id);
  }
}
