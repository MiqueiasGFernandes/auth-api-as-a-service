import { AppModule } from "@application/application.module";
import {
    type MiddlewareConsumer,
    Module,
    type NestModule,
    RequestMethod,
} from "@nestjs/common";
import { SignInController } from "./controllers";
import { RegisterController } from "./controllers/register.controller";
import { IdempotentMiddleware } from "./middlewares/idempotent.middleware";

@Module({
    imports: [AppModule],
    controllers: [RegisterController, SignInController],
})
export class PresentationModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(IdempotentMiddleware).forRoutes({
            path: "*",
            method: RequestMethod.POST,
        });
    }
}
