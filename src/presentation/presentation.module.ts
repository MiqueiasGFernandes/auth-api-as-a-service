import { AppModule } from "@application/application.module";
import {
    type MiddlewareConsumer,
    Module,
    type NestModule,
    RequestMethod,
} from "@nestjs/common";
import { RegisterController, SignInController } from "./controllers";
import { IdempotentMiddleware } from "./middlewares";

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
