import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import config from './config';

@Module({
	imports: [TypegooseModule.forRoot(config.mongoURL)],
})
export class AppModule {}
