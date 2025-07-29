import { SETTINGS_FETCH_GATEWAY } from "@application/gateways";
import { USER_REPOSITORY } from "@application/repositories/user.repository";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocalSettingsFetcherGateway } from "./gateways";
import { TypeOrmuUserRepository } from "./repositories/typeorm-user.repository";

@Global()

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: "postgres",
                host: configService.get("DB_HOST"),
                port: +configService.get("DB_PORT"),
                username: configService.get("DB_USERNAME"),
                password: configService.get("DB_PASSWORD"),
                database: configService.get("DB_NAME"),
                entities: [],
            }),
        }),
    ],
    providers: [
        {
            provide: SETTINGS_FETCH_GATEWAY,
            useClass: LocalSettingsFetcherGateway,
        },
        {
            provide: USER_REPOSITORY,
            useClass: TypeOrmuUserRepository,
        },
    ],
})
export class InfraModule { }
