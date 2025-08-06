import { IsNotEmpty, IsString } from "class-validator"

export class UserInputDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    password: string
}