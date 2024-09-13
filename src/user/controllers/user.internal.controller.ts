import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from '../services/user.service';

@Controller()
export class UserInternalController {
	constructor(private readonly userService: UserService) {}

	@MessagePattern({ cmd: 'AUTH_GET_ALL_USERS_EXCEPT_LOGEDIN_USER' })
	async getAllUserExceptLoginUser({ id }: { id: string }) {
		return await this.userService.getAllUserExceptLoginUser(id);
	}
	@MessagePattern({ cmd: 'AUTH_GET_SINGLE_USER_DETAILS' })
	async getUserDetails({ id }: { id: string }) {
		return await this.userService.getUserDetails(id);
	}
	@MessagePattern({ cmd: 'AUTH_GET_PARTICIPANTS_DETAILS' })
	async getParticipantsDetails({ participantIds }: { participantIds: string[] }) {
		return await this.userService.getParticipantsDetails(participantIds);
	}
	@MessagePattern({ cmd: 'AUTH_GET_PARTICIPANTS_DETAILS_FOR_CONVERSATION' })
	async getParticipantsDetailsForConversation({ senderId, receiverId }: { senderId: string; receiverId: string }) {
		return await this.userService.getParticipantsDetailsForConversation(senderId, receiverId);
	}
}
