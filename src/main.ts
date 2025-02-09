import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  AllExceptionsFilter,
  GlobalResponseTransformer,
} from './utils/response/exception';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Alap Auth Service')
    .setDescription('HTTP API docs for Alap Auth Service')
    .addBearerAuth({
      description: 'User JWT Token',
      type: 'http',
      name: 'Authorization',
      bearerFormat: 'JWT',
    })
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
};

async function bootstrap() {
  const logger = new Logger('ApplicationStartup', { timestamp: true });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: configService.getOrThrow<string>('redis.host'),
      port: configService.getOrThrow<number>('redis.port'),
    },
  });

  app.enableCors({
    origin: '*',
  });
  await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new GlobalResponseTransformer());

  if (configService.getOrThrow<string>('env') !== 'production') {
    setupSwagger(app);
  }

  const port = configService.getOrThrow<number>('port');

  await app.listen(port, '0.0.0.0', (err) => {
    if (err) logger.error(err.message, err.stack, err.name);
    logger.log(`APP Started on Port http://localhost:${port}/api`);
  });
}
bootstrap();
