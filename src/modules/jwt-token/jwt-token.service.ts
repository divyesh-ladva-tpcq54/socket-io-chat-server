import { injectable } from "tsyringe";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ConfigService } from "../config/config.service";

@injectable()
export class JwtToken {
  constructor(private configService: ConfigService) { }

  public sign(payload: any): string {
    const secret = this.configService.get("JWT_SECRET_KEY")
    if (!secret) {
      throw new Error(`the key "JWT_SECRET_KEY" is not set, this is key is needed for signing jwt tokens`);
    }

    return jwt.sign(payload, secret, {});
  }

  public verify(token: string): JwtPayload | string {
    const secret = this.configService.get("JWT_SECRET_KEY")
    if (!secret) {
      throw new Error(`the key "JWT_SECRET_KEY" is not set, this is key is needed for signing jwt tokens`);
    }

    return jwt.verify(token, secret);
  }
}
