import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../dto/auth.dto';

@Controller()
export class AuthInternalController {
	constructor(private readonly authService: AuthService) {}

	@MessagePattern({ cmd: 'AUTH_CREATE_USER' })
	async createGuestUser(data: CreateUserDto) {
		return await this.authService.createUser(data);
	}
}
