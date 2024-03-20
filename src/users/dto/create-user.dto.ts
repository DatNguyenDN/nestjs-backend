//DTO => Data Transfer Object // class ={}

import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({
    message: 'Email must not be empty',
  })
  email: string;

  @IsNotEmpty({
    message: 'Password must not be empty',
  })
  password: string;

  name: string;

  address: string;
}
