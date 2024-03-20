/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(datnguyen: CreateUserDto) {
    const hashPassword = this.getHashPassword(datnguyen.password);
    // eslint-disable-next-line prefer-const
    let user = await this.UserModel.create({
      email: datnguyen.email,
      password: hashPassword,
      name: datnguyen.name,
    });
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found user';

    return this.UserModel.findOne({
      _id: id,
    });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash); //true or false
  }

  findOneByUsername(username: string) {
    return this.UserModel.findOne({
      email: username,
    });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.UserModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found user';

    return this.UserModel.softDelete({
      _id: id,
    });
  }
}
