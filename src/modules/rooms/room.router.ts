import { Router } from "express";
import { injectable } from "tsyringe";
import { RoomController } from "./room.controller";

@injectable()
export class RoomRouter {
  private router: Router;
  constructor(private roomController: RoomController) { 
    this.router = Router();
    this.initRouter();
  }

  private initRouter() {
    this.router.get('/just', this.roomController.just);
  }

  public getRouter() {
    return this.router;
  }
}
