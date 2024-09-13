import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserInternalController } from './controllers/user.internal.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { PendingUser, User } from 'src/auth/entities/auth.entity';

@Module({
	imports: [TypegooseModule.forFeature([User, PendingUser])],
	controllers: [UserController, UserInternalController],
	providers: [UserService],
})
export class UserModule {}
