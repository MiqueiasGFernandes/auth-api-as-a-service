import "dotenv/config";

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InfraProviders } from "./infra.providers";
import { TypeOrmUserModel } from "./models";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        JwtModule.register({
            global: true,
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
                entities: [TypeOrmUserModel],
            }),
        }),
    ],
    providers: [...InfraProviders],
    exports: [...InfraProviders],
})
export class InfraModule { }
