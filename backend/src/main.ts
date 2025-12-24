import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ["http://localhost:5173"],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Kiosk API")
    .setVersion("1.0")
    .setDescription("Kiosk Test")
    .build();

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`running on: http://localhost:${port}`);
}

bootstrap();
