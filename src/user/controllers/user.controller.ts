import { Controller, Get } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User related operations')
@Controller('auth')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('/users')
	async getAllUsers() {
		return await this.userService.getAllUsers();
	}
	@Get('/pending-users')
	async getAllPendingUsers() {
		return await this.userService.getAllPendingUsers();
	}
}
