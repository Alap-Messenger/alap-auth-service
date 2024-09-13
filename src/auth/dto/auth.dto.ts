import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
}

export class LoginDto {
	@ApiProperty({ required: true, type: String })
	@IsString()
	email: string;

	@ApiProperty({ required: true, type: String })
	@IsString()
	password: string;
}
