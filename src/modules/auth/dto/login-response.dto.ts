import { UserEntity } from "../entities/user.entity";

export class LoginResponse{
    accessToken:string;
    user: UserEntity;
}