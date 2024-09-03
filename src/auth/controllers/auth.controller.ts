import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CreateUserDto, LoginDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {
	constructor(@Inject(AuthService) private readonly authService: AuthService) {}

	@Throttle({ Option: { ttl: 86400, limit: 5 } })
	@ApiTags('Auth Related Operations')
	@Post('create-user')
	async createUser(@Body() body: CreateUserDto) {
		return this.authService.createUser(body);
	}

	@Throttle({ Option: { ttl: 86400, limit: 1 } })
	@Post('login-user')
	async userLogin(@Body() body: LoginDto) {
		return this.authService.userLogin(body);
	}
	@Throttle({ Option: { ttl: 86400, limit: 1 } })
	@ApiBearerAuth()
	@UseGuards(AuthGuard)
	@Post('logout-user')
	async userLogout() {
		return this.authService.userLogout();
	}

	@Throttle({ Option: { ttl: 86400, limit: 1 } })
	@ApiBody({
		required: true,
		schema: {
			type: 'object',
			properties: {
				email: { type: 'string' },
			},
		},
	})
	@Post('activate-user-account')
	async activateUserAccount(@Body() body: { email: string }) {
		return this.authService.activateUserAccount(body);
	}

	@Throttle({ Option: { ttl: 1, limit: 1 } })
	@ApiBody({ required: true, schema: { type: 'object', properties: { email: { type: 'string' } } } })
	@Post('check-user-mail')
	async checkUserMail(@Body() body: { email: string }) {
		return this.authService.checkUserMail(body);
	}

	@Throttle({ Option: { ttl: 1, limit: 1 } })
	@ApiBody({
		required: true,
		schema: {
			type: 'object',
			properties: {
				email: { type: 'string' },
				token: { type: 'string' },
				accounttype: { type: 'string' },
			},
		},
	})
	@Post('account-activation-link-validation-check')
	async verifyActivationLinkValidity(@Body() body: { email: string; token: string; accounttype: string }) {
		return this.authService.verifyActivationLinkValidity(body);
	}

	@Throttle({ Option: { ttl: 1, limit: 1 } })
	@ApiBody({
		required: true,
		schema: {
			type: 'object',
			properties: {
				email: { type: 'string' },
			},
		},
	})
	@Post('resend-account-activation-link')
	async resendAccountActivationLink(@Body() body: { email: string }) {
		return this.authService.resendAccountActivationLink(body);
	}
}
