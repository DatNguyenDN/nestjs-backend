import { CreateJobDto } from './create-job.dto';
import { OmitType } from '@nestjs/mapped-types';

import { IsNotEmpty } from 'class-validator';

export class UpdateJobDto extends OmitType(CreateJobDto, ['company'] as const) {
  @IsNotEmpty({ message: '_id can not empty' })
  _id: string;
}
