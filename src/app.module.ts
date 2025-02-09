import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GlobalConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [GlobalConfigModule, AuthModule, UsersModule],
})
export class AppModule {}
