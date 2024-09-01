import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { RedisMessages } from 'src/modules/microservice-client/messages';
import { MicroserviceClient } from 'src/modules/microservice-client/microservice-client.module';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
		// @InjectModel(ForgotPassword) private readonly forgotPasswordModel: ReturnModelType<typeof ForgotPassword>,
		private readonly jwtService: JwtService,
		private redis: MicroserviceClient,
	) {}

	async createUser(body: CreateUserDto): Promise<User> {
		console.log({ body });
		const mailSend = await this.redis.send(RedisMessages.COMMUNICATION_SEND_USER_VERIFICATION_MAIL, body);
		if (!mailSend?.success) throw new HttpException('Can not communicate with communication service', 500);
		console.log({ mailSend });
		return await this.userModel.create(body);
	}
}
