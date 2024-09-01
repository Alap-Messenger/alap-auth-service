import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import config from './config';
import { AllExceptionsFilter, GlobalResponseTransformer } from './utils/response/exception';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

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
	const logger = new Logger('Startup', { timestamp: true });
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.REDIS,
		options: {
			host: config.redisHost,
			port: config.redisPort,
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

	if (process.env.NODE_ENV !== 'production_environment') {
		setupSwagger(app);
	}

	await app.listen(config.port, '0.0.0.0', (err) => {
		if (err) logger.error(err.message, err.stack, err.name);
		logger.log(`APP Started on Port http://localhost:${config.port}/api`);
	});
}
bootstrap();
