
import { ConflictException, Injectable, NotFoundException, HttpException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { generateAccessToken, hashData } from './auth.utils';
import * as bcrypt from 'bcrypt';
import { LoginResponse } from './dto/login-response.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService{
    constructor(
        @InjectRepository(UserEntity) 
        private userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ){}

    public async signUp(signUpUserDto: SignUpUserDto): Promise<UserEntity> {
        let user = await this.userRepository.findOne({ where: { email: signUpUserDto.email}});
        if(user) throw new ConflictException(`User ${signUpUserDto.email} already exists`);
        signUpUserDto = {...signUpUserDto, password: await hashData(signUpUserDto.password)}
        user = this.userRepository.create(signUpUserDto);
        return await this.userRepository.save(user);
    }

    public async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
        let user = await this.userRepository.findOne({ where: { email: loginUserDto.email}});
        if(!user) throw new NotFoundException(`User with email: ${loginUserDto.email} doesn't exist`);

        const passwordMatches = await bcrypt.compare(loginUserDto.password, user.password);

        if(!passwordMatches) throw new BadRequestException(`Invalid email/password`);
        const accessToken = await generateAccessToken(user.id, user.email, this.jwtService);
        return {accessToken, user};
    }
}