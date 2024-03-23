//DTO => Data Transfer Object // class ={}

import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}

export class CreateJobDto {
  @IsNotEmpty({ message: 'Name must not be empty' })
  name: string;

  @IsNotEmpty({ message: 'Skills must not be empty' })
  @IsArray({ message: 'skills must be an Array' })
  @IsString({ each: true, message: 'skill must be a string' })
  skills: string[];

  @IsNotEmpty({ message: 'location must not be empty' })
  location: string;

  @IsNotEmpty({ message: 'salary must not be empty' })
  salary: number;

  @IsNotEmpty({ message: 'quantity must not be empty' })
  quantity: number;

  @IsNotEmpty({ message: 'level must not be empty' })
  level: string;

  @IsNotEmpty({ message: 'description must not be empty' })
  description: string;

  @IsNotEmpty({ message: 'startDate must not be empty' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'startDate must be in Date type' })
  startDate: Date;

  //validate endDate must not before startDate >>> dayjs library

  @IsNotEmpty({ message: 'endDate must not be empty' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'endDate must be in Date type' })
  endDate: Date;

  @IsNotEmpty({ message: 'isActive must not be empty' })
  @IsBoolean({ message: 'isActive must be in boolean type' })
  isActive: boolean;

  // @IsDate()
  // createdAt: Date;

  //validate Object
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}
