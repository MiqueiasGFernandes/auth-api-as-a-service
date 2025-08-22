import type { Result, SessionTokenOutputDto } from "@application/dto";
import {
    type ISettingsFetcherGateway,
    SETTINGS_FETCH_GATEWAY,
} from "@application/gateways";
import {
    type IPasswordEncryptorPort,
    type ISessionTokenPort,
    PASSWORD_ENCRYPTATOR_PORT,
    SESSION_TOKEN_PORT,
} from "@application/ports";
import {
    type IUserRepository,
    USER_REPOSITORY,
} from "@application/repositories";
import type { ICredentialsAuthenticatorUseCase } from "@domain/use-cases";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class RemoteCredentialsAuthenticatorUseCase
    implements ICredentialsAuthenticatorUseCase {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
        @Inject(PASSWORD_ENCRYPTATOR_PORT)
        private readonly passwordEncryptationPort: IPasswordEncryptorPort,
        @Inject(SESSION_TOKEN_PORT)
        private readonly sessionTokenPort: ISessionTokenPort,
        @Inject(SETTINGS_FETCH_GATEWAY)
        private readonly settingsFetchGateway: ISettingsFetcherGateway,
    ) { }

    async execute(
        username: string,
        password: string,
    ): Promise<Result<SessionTokenOutputDto>> {
        const unauthorizedResult = {
            code: HttpStatus.UNAUTHORIZED,
            success: false,
            error: `Invalid username or password`,
        };

        const user = await this.userRepository.findOneBy({
            username,
        });

        if (!user) {
            return unauthorizedResult;
        }

        const isSamePassword = await this.passwordEncryptationPort.compare(
            password,
            user.encryptedPassword,
        );

        if (!isSamePassword) {
            return unauthorizedResult;
        }

        const expirationTime = await this.settingsFetchGateway.get<string>(
            "AUTHENTICATION.TOKEN_EXPIRATION_TIME",
        );

        const sessionToken = await this.sessionTokenPort.sign(user, expirationTime);

        return {
            code: HttpStatus.CREATED,
            success: true,
            data: sessionToken,
        };
    }
}
