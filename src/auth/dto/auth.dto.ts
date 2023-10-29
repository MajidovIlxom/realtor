import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class AuthDto {
    @IsEmail()
    readonly email: string;

    
    @IsStrongPassword()
    readonly password: string;
}
