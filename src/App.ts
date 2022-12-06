import express, { Application, NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { AuthRouter } from './modules/auth/auth.router';
import cors from 'cors'

@injectable()
export class App {
  private app: Application;

  constructor(private authRouter: AuthRouter) { 
    this.app = express();
    this.initRoutes();
  }

  private initRoutes() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use('/auth', this.authRouter.getRouter())
  }

  public getInstance(): Application {
    return this.app;
  }
}
