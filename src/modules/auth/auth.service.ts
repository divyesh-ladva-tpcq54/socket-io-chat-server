import { injectable } from "tsyringe";
import { User } from "../users/user.model";
import { UserService } from "../users/user.service";

@injectable()
export class AuthService {
  constructor(private userService: UserService) { }
  async createUser(username: string): Promise<User | boolean> {
    if (username)
      return await this.userService.createUser(username);
    
    return false;
  }

  async login(username: string): Promise<User | null> {
    if (username)
      return await this.userService.findOne(username);
    
    return null;
  }
}
