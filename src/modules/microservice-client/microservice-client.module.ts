import { DynamicModule, Global, Inject, Logger, Module } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { MessageDataReturn, RedisMessages } from './messages';

export class MicroserviceClient {
	private logger = new Logger(MicroserviceClient.name);
	constructor(@Inject('REDIS_CLIENT') private client: ClientProxy) {}

	async send<T extends RedisMessages>(
		message: T,
		data: MessageDataReturn[T]['payload'],
	): Promise<MessageDataReturn[T]['return']> {
		try {
			return await firstValueFrom(
				this.client.send<MessageDataReturn[T]['return']>({ cmd: message }, data).pipe(timeout(50000)),
			);
		} catch (error) {
			this.logger.error(`[RPC_CALL_TIMEOUT] [MESSAGE] -> [${message}] `, error ?? new Error().stack);
		}
	}
}

@Global()
@Module({})
export class MicroServiceClientModule {
	static register(url: string, port: number): DynamicModule {
		return {
			module: MicroServiceClientModule,
			providers: [
				{
					provide: 'REDIS_CLIENT',
					useFactory: () =>
						ClientProxyFactory.create({
							transport: Transport.REDIS,
							options: {
								host: url,
								port: port,
							},
						}),
				},
				MicroserviceClient,
			],
			exports: ['REDIS_CLIENT', MicroserviceClient],
		};
	}
}
