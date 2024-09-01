export class RedisSingleMessageType<T, U> {
	payload: T;
	return: U;
}

export enum RedisMessages {
	COMMUNICATION_SEND_USER_VERIFICATION_MAIL = 'COMMUNICATION_SEND_USER_VERIFICATION_MAIL',
}

export class MessageDataReturn {
	[RedisMessages.COMMUNICATION_SEND_USER_VERIFICATION_MAIL]: RedisSingleMessageType<any, any>;
}
