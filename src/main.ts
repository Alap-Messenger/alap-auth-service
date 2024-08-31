import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import config from './config';

const setupSwagger = (app: INestApplication) => {
	const options = new DocumentBuilder()
		.setTitle('Alap Communication Service')
		.setDescription('HTTP API docs for Alap Communication Service')
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

	app.enableCors({
		origin: '*',
	});
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	if (process.env.NODE_ENV !== 'production_environment') {
		setupSwagger(app);
	}

	await app.listen(config.port, '0.0.0.0', (err) => {
		if (err) logger.error(err.message, err.stack, err.name);
		logger.log(`APP Started on Port http://localhost:${config.port}/api`);
	});
}
bootstrap();
