import { singleton } from "tsyringe";

@singleton()
export class ActiveUserHolder {
  private userSocketMapping: Record<string, string[]>;
  
  constructor() {
    this.userSocketMapping = {};
  }

  public getUserSockets(username: string) {
    return this.userSocketMapping[username];
  }

  public isUserActive= (username: string): boolean => {
    return (this.userSocketMapping[username] && this.userSocketMapping[username].length > 0);
  }

  public findAndDeleteAllSockets = (username: string) => {
    if (!this.userSocketMapping[username]) {
      return;
    }

    delete this.userSocketMapping[username];
  }

  public findAndDeleteSingleSocket = (username: string, id: string) => {
    if (!this.userSocketMapping[username]) {
      return;
    }

    const elementIndex = this.userSocketMapping[username].indexOf(id);

    if (elementIndex == -1) {
      return;
    }

    this.userSocketMapping[username].splice(elementIndex, 1);

    if (this.userSocketMapping[username].length === 0) {
      delete this.userSocketMapping[username];
    }
  }

  public addUsernameSocket = (username: string, id: string) => {
    if (this.userSocketMapping[username]) {
      this.userSocketMapping[username].push(id)
    } else {
      this.userSocketMapping[username] = [ id ]
    }
  }
}
