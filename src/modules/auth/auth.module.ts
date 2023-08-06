import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { TOKEN_EXPIRATION_TIME, TOKEN_SECRET } from "./constants/auth.constants";
import { PassportModule } from "@nestjs/passport";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";

@Module({
    imports:[
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({
            secret: TOKEN_SECRET,
            signOptions: { expiresIn: TOKEN_EXPIRATION_TIME },
          })
    ],
    controllers: [AuthController],
    providers:[AuthService, AccessTokenStrategy]
})
export class AuthModule{}