import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ReturnModelType } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { InjectModel } from 'nestjs-typegoose';
import { RedisMessages } from 'src/modules/microservice-client/messages';
import { MicroserviceClient } from 'src/modules/microservice-client/microservice-client.module';
import { emailRegex, nameRegex, passwordRegex } from 'src/utils/validation';
import { CreateUserDto } from '../dto/create-user.dto';
import { PendingUser, User } from '../entities/user.entity';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(PendingUser) private readonly pendingUserModel: ReturnModelType<typeof PendingUser>,
		@InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
		private readonly jwtService: JwtService,
		private redis: MicroserviceClient,
	) {}

	async createUser(body: CreateUserDto): Promise<string> {
		const { userName, password, cPassword, email } = body;

		const alreadyExists = await this.checkUserMail({ email });
		if (alreadyExists) throw new HttpException('Email already exist. Verify your account.', 400);

		// Validate username
		if (!nameRegex.test(userName)) {
			throw new HttpException(
				'Username must start with a letter and can only contain letters, numbers, and underscores (_)',
				400,
			);
		}

		// Validate password
		if (!passwordRegex.test(password)) {
			throw new HttpException(
				'Password must be 6-12 characters long, contain at least one uppercase letter, one number, and one special character',
				400,
			);
		}

		// Check if passwords match
		if (password !== cPassword) {
			throw new HttpException('Passwords do not match', 400);
		}
		const verificationToken = randomBytes(32).toString('hex');
		const tokenExpiration = new Date();
		tokenExpiration.setHours(tokenExpiration.getHours() + 24); // Token valid for 24 hours

		const userData: PendingUser = {
			userName,
			email,
			password: bcrypt.hashSync(password, 14),
			verificationToken,
			tokenExpiration,
		};
		const pendingUser = await this.pendingUserModel.create(userData);
		if (!pendingUser) throw new HttpException('Account not created. Try again later', 500);

		const verificationMail = await this.redis.send(RedisMessages.COMMUNICATION_SEND_USER_VERIFICATION_MAIL, {
			userName: pendingUser?.userName,
			email: pendingUser?.email,
			accountType: pendingUser?.type,
			verificationToken: pendingUser?.verificationToken,
		});

		if (!verificationMail) {
			throw new HttpException('Failed to send verification email. Please try again later.', 500);
		}
		return 'Sent verification mail. Please check your email inbox.';
	}

	async activateUserAccount(body: { email: string }): Promise<string> {
		try {
			// Step 1: Find the user in the pendingUsers collection
			const user = await this.pendingUserModel.findOne({ email: body.email });
			if (!user) {
				throw new HttpException('User not found in pending users.', 404);
			}

			// Step 2: Insert the user into the users collection
			await this.userModel.create({
				userName: user?.userName,
				email: user?.email,
				password: user?.password,
				type: user?.type,
				avatar: user?.avatar,
				verify: true,
				verificationToken: user?.verificationToken,
				tokenExpiration: user?.tokenExpiration,
				createdAt: user?.createdAt,
				updatedAt: user?.updatedAt,
			});

			// Step 3: Delete the user from the pendingUsers collection
			await this.pendingUserModel.deleteOne({ email: body?.email });

			return 'User account has been activated successfully.';
		} catch (error) {
			console.log({ error });
			throw new HttpException('Failed to activate user account. Please try again later.', 500);
		}
	}

	async checkUserMail(body: { email: string }): Promise<PendingUser | User> {
		// Use the correct regex to validate email
		if (!emailRegex.test(body?.email)) {
			throw new HttpException('Invalid Email format.', 400);
		}

		// Check for pending user
		const pendingUser = await this.pendingUserModel.findOne({ email: body.email });
		if (pendingUser) {
			throw new HttpException('User already exists. Check your email to verify your account.', 409);
		}

		// Check for verified user
		const user = await this.userModel.findOne({ email: body.email });
		if (user) {
			throw new HttpException('Email already registered. Please log in.', 409);
		}

		return;
	}

	async verifyActivationLinkValidity(body: { email: string; token: string; accounttype: string }): Promise<void> {
		const pendingUser = await this.pendingUserModel.findOne({
			$and: [{ email: body?.email }, { verificationToken: body?.token }, { type: body?.accounttype }],
		});

		if (!pendingUser) {
			throw new HttpException('Unauthorized Access!', 400);
		}

		if (pendingUser.tokenExpiration.getTime() < Date.now()) {
			throw new HttpException('Token has expired. Please request a new verification email.', 400);
		}
	}

	async resendAccountActivationLink(body: { email: string }): Promise<string> {
		const pendingUser = await this.pendingUserModel.findOne({ email: body?.email });
		if (!pendingUser) {
			throw new HttpException('User not found or already verified.', 404);
		}

		// Resend the verification email with the updated token expiration
		const resendEmail = await this.redis.send(RedisMessages.COMMUNICATION_SEND_USER_VERIFICATION_MAIL, {
			userName: pendingUser?.userName,
			email: pendingUser?.email,
			accountType: pendingUser?.type,
			verificationToken: pendingUser?.verificationToken,
		});

		if (!resendEmail) {
			throw new HttpException('Failed to send verification email. Please try again later.', 500);
		}

		// Update the token expiration time (e.g., add another 24 hours)
		const newTokenExpiration = new Date();
		newTokenExpiration.setHours(newTokenExpiration.getHours() + 24);

		// Save the updated expiration date to the database
		pendingUser.tokenExpiration = newTokenExpiration;
		await pendingUser.save();

		return 'Resend account verification email. Check your email inbox.';
	}
}
