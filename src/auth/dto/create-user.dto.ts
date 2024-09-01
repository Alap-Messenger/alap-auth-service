import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { UserTypeEnum } from '../enums/user.enum';

export class CreateUserDto {
	@ApiProperty({ required: true, type: String })
	@IsNotEmpty({ message: 'Username is required!' })
	@IsString()
	userName: string;

	@ApiProperty({ required: true, type: String })
	@IsNotEmpty({ message: 'Email is required!' })
	@IsString()
	email: string;

	@ApiProperty({ required: true, type: String })
	@IsNotEmpty({ message: 'Password is required!' })
	@IsString()
	password: string;

	@ApiProperty({ required: true, type: String })
	@IsNotEmpty({ message: 'Confirm Password is required!' })
	@IsString()
	cPassword: string;

	@ApiProperty({ required: false, type: String })
	@IsString()
	avatar: string;

	@ApiProperty({ required: false, default: false })
	@IsBoolean()
	verify?: boolean;

	@ApiProperty({ required: false, enum: UserTypeEnum, default: UserTypeEnum.USER })
	@IsString()
	type?: UserTypeEnum;
}
