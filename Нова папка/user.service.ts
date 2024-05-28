import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDoc, Users } from '../schema';
import { LoginDto, UserDto } from '../models';
import { UserAlreadyExists, UserNotFound } from '../shared';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UserDoc>,
  ) {}

  async createUser(body: UserDto) {
    const isExists = await this.userModel.findOne({ email: body.email });

    if (isExists) {
      throw new UserAlreadyExists(`This email: ${body.email} is already in use`);
    }

    const doc = new this.userModel(body);
    const user = await doc.save();
    return user.toObject();
  }

  async login(body: LoginDto) {
    const user = await this.userModel.findOne({
      email: body.email,
      password: body.password,
    });

    if (!user) {
      throw new UserNotFound(`User with email ${body.email} was not found`);
    }

    user.token = randomUUID();
    await user.save();
    return user.token;
  }

  async findByToken(token: string): Promise<UserDoc> {
    return this.userModel.findOne({ token }).exec();
  }

  async updateUserXP(user: UserDoc, xp: number): Promise<UserDoc> {
    user.xp += xp;
    const nextLevelXp = 10 * user.level; 
    if (user.xp >= nextLevelXp) {
      user.level += 1;
      user.xp -= nextLevelXp;
    }
    return user.save();
  }
}
