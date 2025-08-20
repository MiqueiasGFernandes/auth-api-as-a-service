import type { Result, UserInputDto, UserOutputDto } from "@application/dto";
import {
    type ISettingsFetcherGateway,
    SETTINGS_FETCH_GATEWAY,
} from "@application/gateways";
import { UserMapper } from "@application/mappers";
import {
    type IPasswordEncryptorPort,
    PASSWORD_ENCRYPTATOR_PORT,
} from "@application/ports";
import type { IUserRepository } from "@application/repositories";
import { USER_REPOSITORY } from "@application/repositories/user.repository";
import type { FieldType } from "@domain/entities";
import type { IAddUserUseCase } from "@domain/use-cases";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class RemoteAddUserUseCase implements IAddUserUseCase {
    constructor(
        @Inject(SETTINGS_FETCH_GATEWAY)
        private readonly settingsFetcherGateway: ISettingsFetcherGateway,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(PASSWORD_ENCRYPTATOR_PORT)
        private readonly passwordEncryptator: IPasswordEncryptorPort,
    ) { }
    async execute(input: UserInputDto): Promise<Result<UserOutputDto>> {
        const usernameFieldType = await this.settingsFetcherGateway.get<FieldType>(
            "AUTHENTICATION.USERNAME_FIELD_TYPE",
        );

        const isDuplicatedUser =
            (await this.userRepository.countBy({
                username: input.username,
            })) > 0;

        if (isDuplicatedUser) {
            return {
                code: HttpStatus.CONFLICT,
                success: false,
                error: `User ${input.username} already exists`,
            };
        }

        const userEntity = UserMapper.toDomain(input);

        const isValidUsername =
            userEntity.isValidUsernameByFieldType(usernameFieldType);

        if (!isValidUsername) {
            return {
                code: HttpStatus.UNPROCESSABLE_ENTITY,
                success: false,
                error: `Your ${usernameFieldType} is invalid`,
            };
        }

        const isStrongPassword = userEntity.isStrongPassword();

        if (!isStrongPassword) {
            return {
                code: HttpStatus.BAD_REQUEST,
                success: false,
                error:
                    "Your password must contain upper and lower case characters, numbers and symbols",
            };
        }

        input.password = await this.passwordEncryptator.encrypt(input.password)

        const output = await this.userRepository.create(input);

        return {
            code: HttpStatus.OK,
            success: true,
            data: output,
        };
    }
}
