import { Injectable, BadRequestException } from '@nestjs/common';
import { LoginDto, UserDto } from '../models';
import { UserDoc, Users } from '../schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserAlreadyExists, UserNotFound } from '../shared';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name)
    private readonly userModel: Model<UserDoc>,
  ) {}

  async createUser(body: UserDto) {
    const isExists = await this.userModel.findOne({
      login: body.email,
    });

    if (isExists) {
      throw new UserAlreadyExists(
        `This email: ${body.email} is already in use`,
      );
    }

    const apiKey = uuidv4();

    const doc = new this.userModel({ ...body, apiKey: apiKey });

    const user = await doc.save();

    return user.toObject();
  }

  async login(body: LoginDto) {
    const user = await this.userModel.findOne({
      email: body.email,
      password: body.password,
    });

    if (!user) {
      throw new BadRequestException(`User with login ${body.email} was not found`);
    }
   
    return { email:user.email, password:user.password, message:'USERS LOGIN DATA'};
  }
}
