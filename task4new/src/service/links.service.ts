import { Injectable } from '@nestjs/common';
import { CreateLinkDto } from '../models';
import { LinksDoc, Links } from '../schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LinksService {
  constructor(
    @InjectModel(Links.name)
    private readonly linksModel: Model<LinksDoc>,
  ) {}

  async createLink( body:CreateLinkDto ) {

    const link = new this.linksModel( {
      originalLink : body.originalLink,
      shortLink : body.shortLink,
      expiredAt : body.expiredAt
    } ) ;

    const createdLink = await link.save();
    return createdLink;
  }
}
