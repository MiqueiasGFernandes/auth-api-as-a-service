import { AppModule } from "@application/application.module";
import { NestFactory } from "@nestjs/core";
import { HttpExceptionFilter } from "@presentation/filters/exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
