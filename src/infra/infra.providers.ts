import { SETTINGS_FETCH_GATEWAY } from "@application/gateways";
import { USER_REPOSITORY } from "@application/repositories/user.repository";
import type { Provider } from "@nestjs/common";
import { LocalSettingsFetcherGateway } from "./gateways";
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
];
