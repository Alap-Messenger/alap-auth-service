import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
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
		return body;
	}
}
