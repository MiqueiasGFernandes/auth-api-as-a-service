import { BootstrapModule } from "@bootstrap/bootstrap.module";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { HttpExceptionFilter } from "@presentation/filters";
import { ResultInterceptor } from "@presentation/interceptors";

async function bootstrap() {
  const app = await NestFactory.create(BootstrapModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResultInterceptor());
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));

  await app.listen(3000);
}
bootstrap();
