import { AppModule } from "@application/application.module";
import { Module } from "@nestjs/common";
import { RegisterController } from "./controllers/register.controller";

@Module({
    imports: [AppModule],
    controllers: [RegisterController],
})
export class PresentationModule { }
