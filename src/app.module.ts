import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthModule } from './auth/auth.module';
import config from './config';
import { MicroServiceClientModule } from './modules/microservice-client/microservice-client.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ThrottlerModule.forRoot([
			{
				ttl: 1,
				limit: 1,
			},
		]),
		MicroServiceClientModule.register(config.redisHost, config.redisPort),
		RedisModule.forRoot({
			type: 'single',
			url: config.redisURL,
		}),
		TypegooseModule.forRoot(config.mongoURL),
		ConfigModule.forRoot({ isGlobal: true }),
		AuthModule,
		UserModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
