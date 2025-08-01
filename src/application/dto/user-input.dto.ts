import { IsString } from "class-validator"

export class UserInputDto {
    @IsString()
    username: string

    @IsString()
    password: string
}