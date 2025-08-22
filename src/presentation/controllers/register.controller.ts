/** biome-ignore-all lint/style/useImportType: <class-validator> */
import { Result, UserInputDto, UserOutputDto } from "@application/dto";
import { ADD_USER_USE_CASE, type IAddUserUseCase } from "@domain/use-cases";
import { Body, Controller, Inject, Post } from "@nestjs/common";

@Controller()
export class RegisterController {
    constructor(
        @Inject(ADD_USER_USE_CASE)
        private readonly addUserUseCase: IAddUserUseCase,
    ) { }

    @Post("/signup")
    signUp(@Body() input: UserInputDto): Promise<Result<UserOutputDto>> {
        return this.addUserUseCase.execute(input);
    }
}
