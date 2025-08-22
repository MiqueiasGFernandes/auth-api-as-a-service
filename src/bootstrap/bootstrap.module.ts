import { AppModule } from "@application/application.module";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
    imports: [
        AppModule,
    ]
})
export class BootstrapModule { }