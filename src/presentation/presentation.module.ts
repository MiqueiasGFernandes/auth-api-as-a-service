import { AppModule } from "@application/application.module";
import {
    Global,
    type MiddlewareConsumer,
    Module,
    type NestModule,
    RequestMethod,
} from "@nestjs/common";
import { RegisterController, SignInController } from "./controllers";
import { IdempotentMiddleware } from "./middlewares";

@Global()
@Module({
    imports: [],
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
