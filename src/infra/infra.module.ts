import "dotenv/config"

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InfraProviders } from "./infra.providers";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: configService.getOrThrow("POSTGRES_HOST"),
                port: configService.getOrThrow("POSTGRES_PORT"),
                username: configService.getOrThrow("POSTGRES_USER"),
                password: configService.getOrThrow("POSTGRES_PASSWORD"),
                database: configService.getOrThrow("POSTGRES_DB"),
                entities: [],
            }),
        }),
    ],
    providers: [...InfraProviders],
    exports: [...InfraProviders]
})
export class InfraModule { }
