import { injectable } from "tsyringe";
import { Room } from "../rooms/room.model";
import { User } from "./user.model";

@injectable()
export class UserReporisory {
  public async insert(username: string): Promise<User> {
    const user = new User({
      username
    });

    return await user.save();
  }

  public async findByUsername(username: string): Promise<User | null> {
    const user = await User.findOne({
      where: {
        username
      }
    });

    return user;
  }

  public async findById(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }
}
