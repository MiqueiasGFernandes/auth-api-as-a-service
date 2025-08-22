// biome-ignore lint/style/useImportType: <class validator>
import { Result, SessionTokenOutputDto, UserInputDto } from "@application/dto";
import {
    CREDENTIALS_AUTHENTICATOR_USE_CASE,
    type ICredentialsAuthenticatorUseCase,
} from "@domain/use-cases";
import { Body, Controller, Inject, Post } from "@nestjs/common";

@Controller("/signin")
export class SignInController {
    constructor(
        @Inject(CREDENTIALS_AUTHENTICATOR_USE_CASE)
        private readonly credentialsAuthenticationUseCase: ICredentialsAuthenticatorUseCase,
    ) { }

    @Post("/")
    localSignIn(@Body() input: UserInputDto): Promise<Result<SessionTokenOutputDto>> {
        return this.credentialsAuthenticationUseCase.execute(input.username, input.password)
    }
}
