import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from "./entities/user.entity";
import { SignUpUserDto } from "./dto/signup-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { LoginResponse } from "./dto/login-response.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService){}

    @Post("/signup")
    public async signUp(@Body() signUpUserDto: SignUpUserDto): Promise<UserEntity>{
        return await this.authService.signUp(signUpUserDto);
    }

    @Post("/login")
    public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse>{
        return await this.authService.login(loginUserDto);
    }
}