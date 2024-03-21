//DTO => Data Transfer Object // class ={}

import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name must not be empty' })
  name: string;

  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email must not be empty' })
  email: string;

  @IsNotEmpty({ message: 'Password must not be empty' })
  password: string;

  @IsNotEmpty({ message: 'Age must not be empty' })
  age: number;

  @IsNotEmpty({ message: 'Gender must not be empty' })
  gender: string;

  @IsNotEmpty({ message: 'Address must not be empty' })
  address: string;

  @IsNotEmpty({ message: 'Role must not be empty' })
  role: string;

  //validate Object
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterDto {
  @IsNotEmpty({ message: 'Name must not be empty' })
  name: string;

  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email must not be empty' })
  email: string;

  @IsNotEmpty({ message: 'Password must not be empty' })
  password: string;

  @IsNotEmpty({ message: 'Age must not be empty' })
  age: number;

  @IsNotEmpty({ message: 'Gender must not be empty' })
  gender: string;

  @IsNotEmpty({ message: 'Address must not be empty' })
  address: string;
}
