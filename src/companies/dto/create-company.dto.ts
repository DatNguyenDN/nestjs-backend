//DTO => Data Transfer Object // class ={}

import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Email must not be empty' })
  name: string;

  @IsNotEmpty({ message: 'Password must not be empty' })
  address: string;

  @IsNotEmpty({ message: 'Description must not be empty' })
  description: string;
}
