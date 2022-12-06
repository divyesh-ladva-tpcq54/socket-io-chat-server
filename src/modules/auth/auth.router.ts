import { Router } from "express";
import { injectable } from "tsyringe";
import { AuthController } from "./auth.controller";

@injectable()
export class AuthRouter {
  private router: Router;
  constructor(private authController: AuthController) { 
    this.router = Router();
    this.initRouter();
  }

  private initRouter() {
    this.router.post('/login', this.authController.login);
    this.router.post('/register', this.authController.register);
    this.router.post('/logout', this.authController.logout);
  }

  public getRouter() {
    return this.router;
  }
}
