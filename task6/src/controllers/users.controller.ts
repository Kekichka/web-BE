import {
  BadRequestException,
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { UserService } from '../service';
import { LoginDto, UserDto} from '../models';
import { UserAlreadyExists, UserNotFound } from '../shared'; 

@Controller({ path: '/users' })
export class UsersController {
  constructor(private readonly userService: UserService) { }

  @Post('/')
  async createUser(@Body() body: UserDto) {
    if (!body.login) {
      throw new BadRequestException('This field email is required');
    }
    if (!body.password) {
      throw new BadRequestException('This field password is required');
    }
    try {
      const result = await this.userService.createUser(body);
      return result;
    } catch (err) {
      if (err instanceof UserAlreadyExists) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Post('/login')
  async login(@Body() body: LoginDto) {
    try {
      const result = await this.userService.login(body);
      return { token: result };
    } catch (err) {
      if (err instanceof UserNotFound) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }
}