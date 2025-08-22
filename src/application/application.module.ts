import { CacheModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";
import { PresentationModule } from "@presentation/presentation.module";
import { DomainModule } from "../domain/domain.module";
import { InfraModule } from "../infra/infra.module";
import { ApplicationProviders } from "./application.providers";

@Global()
@Module({
  imports: [
    PresentationModule,
    DomainModule,
    InfraModule,
    CacheModule.register({
      isGlobal: true,
    })],
  providers: [...ApplicationProviders],
  exports: [...ApplicationProviders],
})
export class AppModule { }
