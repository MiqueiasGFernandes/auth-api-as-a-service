import { Module } from "@nestjs/common";
import { DomainModule } from "../domain/domain.module";
import { InfraModule } from "../infra/infra.module";
import { ApplicationProviders } from "./application.providers";

@Module({
  imports: [DomainModule, InfraModule],
  providers: [...ApplicationProviders],
  exports: [...ApplicationProviders]
})
export class AppModule { }
