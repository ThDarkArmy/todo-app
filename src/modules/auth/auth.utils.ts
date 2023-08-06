import * as bcrypt from "bcrypt";
import { JwtPayload } from "./interface/auth.interface";
import { JwtService } from '@nestjs/jwt';
import { TOKEN_EXPIRATION_TIME, TOKEN_SECRET } from "./constants/auth.constants";

export const generateAccessToken = async (userId: string, email: string, jwtService: JwtService): Promise<string> => {

    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const accessToken = await jwtService.signAsync(jwtPayload, {
        secret: TOKEN_SECRET,
        expiresIn: TOKEN_EXPIRATION_TIME,
      })

    return accessToken;
  }

export const hashData = async (data: string): Promise<string> => {
    return await bcrypt.hash(data, 10);
}