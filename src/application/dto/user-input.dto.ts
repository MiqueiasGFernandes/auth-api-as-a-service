import { IsNotEmpty, IsString, MaxLength } from "class-validator"

export class UserInputDto {
    @MaxLength(100)
    @IsString()
    @IsNotEmpty()
    username: string

    @MaxLength(100)
    @IsString()
    @IsNotEmpty()
    password: string
}