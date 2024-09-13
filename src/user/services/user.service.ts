import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { PendingUser, User } from 'src/auth/entities/auth.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
		@InjectModel(PendingUser) private readonly pendingUserModel: ReturnModelType<typeof PendingUser>,
	) {}

	async getAllUsers(): Promise<any> {
		const users = await this.userModel
			.find({})
			.select('-password -verificationToken -tokenExpiration -avatar')
			.exec();
		if (users.length <= 0) {
			throw new Error('No users found!');
		}
		return users;
	}
	async getAllPendingUsers(): Promise<any> {
		const users = await this.pendingUserModel
			.find({})
			.select('-password -verificationToken -tokenExpiration -avatar')
			.exec();
		if (users.length <= 0) {
			throw new Error('No pending users found!');
		}
		return users;
	}
	async getAllUserExceptLoginUser(id: string): Promise<any> {
		const users = await this.userModel
			.find({ _id: { $nin: [id] } })
			.select('-email -password -verificationToken -tokenExpiration -updatedAt -createdAt -verify -type -__v')
			.exec();
		return users;
	}

	async getUserDetails(id: string): Promise<any> {
		const user = await this.userModel
			.findById(id)
			.select('-email -password -verificationToken -tokenExpiration -updatedAt -createdAt -verify -type -__v')
			.exec();
		if (!user) {
			throw new Error('User not found!');
		}
		return user;
	}

	async getParticipantsDetails(participantIds: string[]): Promise<any> {
		const users = await this.userModel
			.find({ _id: { $in: participantIds } })
			.select('-email -password -verificationToken -tokenExpiration -updatedAt -createdAt -verify -type -__v')
			.exec();

		if (!users.length) {
			throw new Error('No users found!');
		}

		const userMap = users.reduce(
			(acc, user) => {
				acc[user?._id.toString()] = user;
				return acc;
			},
			{} as Record<string, any>,
		);

		return userMap;
	}
	async getParticipantsDetailsForConversation(senderId: string, receiverId: string): Promise<any> {
		const users = await this.userModel
			.find({ _id: { $in: [senderId, receiverId] } })
			.select('-email -password -verificationToken -tokenExpiration -updatedAt -createdAt -verify -type -__v')
			.exec();

		if (!users.length) {
			throw new Error('No users found!');
		}

		return users;
	}
}
