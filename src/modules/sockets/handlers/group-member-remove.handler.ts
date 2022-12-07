import { Server, Socket } from "socket.io";
import { injectable } from "tsyringe";
import { User } from "../../users/user.model";

export interface IGroupMemberRemoveData {
  groupName: string,
  username: string
}

@injectable()
export class GroupMemberRemoveHandler {
  constructor() { }

  public handler = async (io: Server, socket: Socket, currentUser: User, data: IGroupMemberRemoveData) => {


  }
}
