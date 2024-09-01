import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
	constructor(@Inject(AuthService) private readonly authService: AuthService) {}

	@Throttle({ Option: { ttl: 1, limit: 1 } })
	@ApiTags('Register user')
	@Post('create-user')
	async createUser(@Body() body: CreateUserDto) {
		return this.authService.createUser(body);
	}
}
