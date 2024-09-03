import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthController } from './controllers/auth.controller';
import { AuthInternalController } from './controllers/auth.internal.controller';
import { PendingUser, User } from './entities/auth.entity';
import { AuthService } from './services/auth.service';
import config from 'src/config';
import * as fs from 'fs';

@Module({
	imports: [
		JwtModule.register({
			publicKey: fs.readFileSync(config.jwtPublicKeyPath, 'utf8'),
			privateKey: fs.readFileSync(config.jwtPrivateKeyPath, 'utf8'),
			secret: config.jwtSecret,
		}),
		TypegooseModule.forFeature([PendingUser, User]),
	],
	controllers: [AuthController, AuthInternalController],
	providers: [AuthService, JwtService],
})
export class AuthModule {}
