import { ADD_USER_USE_CASE } from "@domain/use-cases";
import { Global, Module } from "@nestjs/common";
import { DomainModule } from "../domain/domain.module";
import { InfraModule } from "../infra/infra.module";
import { PresentationModule } from "../presentation/presentation.module";
import { RemoteAddUserUseCase } from "./use-cases/remote-add-user.use-case";

@Global()
@Module({
  imports: [DomainModule, InfraModule, PresentationModule],
  controllers: [],
  providers: [
    {
      provide: ADD_USER_USE_CASE,
      useClass: RemoteAddUserUseCase,
    },
  ],
})
export class AppModule { }
