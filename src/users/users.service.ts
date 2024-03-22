/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from 'src/users/schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import { User } from 'src/decorator/customize';
import aqp from 'api-query-params';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) private UserModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUser: CreateUserDto, @User() user: IUser) {
    const { name, email, password, age, gender, address, role, company } =
      createUser;
    //check email
    const isExist = await this.UserModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email ${email} already exist!`);
    }
    const hashPassword = this.getHashPassword(createUser.password);

    let newUser = await this.UserModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role,
      company,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return newUser;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.UserModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.UserModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any) //ép kiểu dữ liệu
      .select('-password')
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
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found user';

    return await this.UserModel.findOne({
      _id: id,
    }).select('-password'); //exclude password
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash); //true or false
  }

  findOneByUsername(username: string) {
    return this.UserModel.findOne({
      email: username,
    });
  }

  async update(updateUserDto: UpdateUserDto, @User() user: IUser) {
    const updated = await this.UserModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found user';

    await this.UserModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.UserModel.softDelete({
      _id: id,
    });
  }

  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;
    //logic check email
    const isExist = await this.UserModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(` Email ${email} already exist!`);
    }
    const hashPassword = this.getHashPassword(password);
    let newRegister = await this.UserModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: 'USER',
    });
    return newRegister;
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.UserModel.updateOne(
      { _id },
      {
        refreshToken,
      },
    );
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.UserModel.findOne({ refreshToken });
  };
}
