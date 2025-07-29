import { Module } from "@nestjs/common";
import { DomainModule } from "../domain/domain.module";
import { InfraModule } from "../infra/infra.module";
import { PresentationModule } from "../presentation/presentation.module";

@Module({
  imports: [DomainModule, InfraModule, PresentationModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
