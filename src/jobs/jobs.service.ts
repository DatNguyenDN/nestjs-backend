/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/users.interface';

import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { JobDocument } from 'src/jobs/schemas/job.schema';
import { Job as JobModel } from './schemas/job.schema';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(JobModel.name) private JobModel: SoftDeleteModel<JobDocument>,
  ) {}
  async create(createJobDto: CreateJobDto, user: IUser) {
    const {
      name,
      skills,
      company,
      location,
      salary,
      quantity,
      level,
      description,
      startDate,
      endDate,
      isActive,
    } = createJobDto;

    // eslint-disable-next-line prefer-const
    let newJob = await this.JobModel.create({
      name,
      skills,
      company,
      location,
      salary,
      quantity,
      level,
      description,
      startDate,
      endDate,
      isActive,
      createdBy: {
        _id: user._id,
        name: user.name,
      },
    });
    console.log(newJob);
    return {
      _id: newJob?._id,
      createdAt: newJob?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.JobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.JobModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any) //ép kiểu dữ liệu
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hien tai
        pageSize: limit, // so luong ket qua da lay
        pages: totalPages, //tong so trang voi dieu kien query
        total: totalItems, //tong so phan tu
      },
      result, // ket qua query
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found job';

    return await this.JobModel.findById(id);
  }

  async update(_id: string, updateJobDto: UpdateJobDto, user) {
    const updated = await this.JobModel.updateOne(
      { _id },
      {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return updated;
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) return 'Not found job';

    await this.JobModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.JobModel.softDelete({
      _id,
    });
  }
}
