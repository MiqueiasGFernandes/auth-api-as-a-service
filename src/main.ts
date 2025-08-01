import { NestFactory } from "@nestjs/core";
import { HttpExceptionFilter } from "@presentation/filters/exception.filter";
import { ResultInterceptor } from "@presentation/interceptors/response.interceptor";
import { BootstrapModule } from "./bootstrap/bootstrap.module";

async function bootstrap() {
  const app = await NestFactory.create(BootstrapModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResultInterceptor());

  await app.listen(3000);
}
bootstrap();
