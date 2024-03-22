/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public() //k cần truyền jwt
  @ResponseMessage('Register a new user') //msg trả về
  @Post('/register')
  handleRegister(@Body() registerUser: RegisterUserDto) {
    return this.authService.register(registerUser);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('User login') //msg trả về
  @Post('/login')
  handleLogin(
    @Req() req,

    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(req.user, response);
  }

  @ResponseMessage('Get user information')
  @Get('/account')
  handleAccount(@User() user: IUser) {
    //@User => req.user
    console.log(user);
    return { user };
  }
}
