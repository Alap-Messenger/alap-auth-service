import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { emailRegex, passwordRegex } from 'src/utils/validation';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'Full Name' })
  @IsNotEmpty()
  @IsString({ message: 'Full Name is required!' })
  fullName: string;

  @Field(() => String, { description: 'Email address' })
  @IsNotEmpty()
  @IsString({ message: 'Email address is required!' })
  @Matches(emailRegex, { message: 'Invalid email address!' })
  email: string;

  @Field(() => String, { description: 'Password' })
  @IsNotEmpty()
  @IsString({ message: 'Password is required!' })
  @Matches(passwordRegex, {
    message:
      'Password must be between 6-12 characters long and contain at least one uppercase letter, one number, and one special character!',
  })
  password: string;
}
