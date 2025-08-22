import { SETTINGS_FETCH_GATEWAY, VAULT_FETCHER_GATEWAY } from "@application/gateways";
import {
    PASSWORD_ENCRYPTATOR_PORT,
    SESSION_TOKEN_PORT,
} from "@application/ports";
import { USER_REPOSITORY } from "@application/repositories/user.repository";
import type { Provider } from "@nestjs/common";
import {
    BCryptPasswordEncryptationAdapter,
    JwtTokenServiceAdapter
} from "./adapters";
import { DotenvVaultSecretFetchergateway, LocalSettingsFetcherGateway } from "./gateways";
import { TypeOrmuUserRepository } from "./repositories/typeorm-user.repository";

export const InfraProviders: Provider[] = [
    {
        provide: SETTINGS_FETCH_GATEWAY,
        useClass: LocalSettingsFetcherGateway,
    },
    {
        provide: USER_REPOSITORY,
        useClass: TypeOrmuUserRepository,
    },
    {
        provide: PASSWORD_ENCRYPTATOR_PORT,
        useClass: BCryptPasswordEncryptationAdapter,
    },
    {
        provide: SESSION_TOKEN_PORT,
        useClass: JwtTokenServiceAdapter,
    },
    {
        provide: VAULT_FETCHER_GATEWAY,
        useClass: DotenvVaultSecretFetchergateway
    }
];
