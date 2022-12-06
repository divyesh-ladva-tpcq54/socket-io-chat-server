import { NextFunction, Request, Response } from "express";
import { injectable } from "tsyringe";
import { AuthService } from "./auth.service";

@injectable()
export class AuthController {
  constructor(private authService: AuthService) { }
  
  public login = async (req: Request, res: Response, next: NextFunction): Promise<Response | any> => { 
    const user = await this.authService.login(req.body.username);

    if (user) {
      return res.json({ user });
    } else {
      return res.json({ })
    }
  }

  public logout = async (): Promise<Response | any> => { }

  public register = async (req: Request, res: Response): Promise<Response | any> => {
    try {
      const user = await this.authService.createUser(req.body.username);
  
      if (!user) {
        res.json({ message: "user was not created" });
      }
      else {
        res.json({ message: "user was created, you can login" })
      }
    } catch (error: any) {
      if (error.errors[0].validatorKey == "not_unique") {
        res.json({ message: "User already registered please try logging in" });
      }
    }
  }
}
