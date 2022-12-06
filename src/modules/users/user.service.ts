import { injectable } from "tsyringe";
import { User } from "./user.model";
import { UserReporisory } from "./user.repository";

@injectable()
export class UserService {
  constructor(private userRepository: UserReporisory) { }
  
  async createUser(username: string): Promise<User> {
    return this.userRepository.insert(username);
  }

  async findOne(username: string): Promise<User | null> {
    return await this.userRepository.findByUsername(username);
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }
}
