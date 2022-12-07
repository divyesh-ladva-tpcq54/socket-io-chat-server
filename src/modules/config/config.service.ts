import { injectable } from "tsyringe";

@injectable()
export class ConfigService {
  private configRecord: Record<string, string | undefined>;

  constructor() { 
    this.configRecord = {
      JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
    }  
  }

  get(key: string): string | undefined {
    return this.configRecord[key];
  }
}
