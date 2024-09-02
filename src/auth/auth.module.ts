import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthController } from './controllers/auth.controller';
import { AuthInternalController } from './controllers/auth.internal.controller';
import { PendingUser, User } from './entities/user.entity';
import { AuthService } from './services/auth.service';

@Module({
	imports: [JwtModule.register({}), TypegooseModule.forFeature([PendingUser, User])],
	controllers: [AuthController, AuthInternalController],
	providers: [AuthService, JwtService],
})
export class AuthModule {}
