import { Injectable, NotFoundException } from '@nestjs/common';
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

  async createLink(apiKey: string, body: CreateLinkDto) {
    const link = new this.linksModel({
      originalLink: body.originalLink,
      shortLink: body.shortLink,
      expiredAt: body.expiredAt,
      apiKey: apiKey,
    });

    const createdLink = await link.save();
    return createdLink;
  }

  async getLinks(apiKey: string, gtExpiredAt?: Date, ltExpiredAt?: Date): Promise<LinksDoc[]> {
    let query: any = { apiKey };

    if (gtExpiredAt && ltExpiredAt) {
      query = {
        ...query,
        expiredAt: {
          $gt: gtExpiredAt,
          $lt: ltExpiredAt,
        },
      };
    } else if (gtExpiredAt) {
      query = {
        ...query,
        expiredAt: {
          $gt: gtExpiredAt,
        },
      };
    } else if (ltExpiredAt) {
      query = {
        ...query,
        expiredAt: {
          $lt: ltExpiredAt,
        },
      };
    }

    return this.linksModel.find(query).exec();
  }
  async getOriginalLink(cut: string): Promise<any> {
    const link = await this.linksModel.findOne({shortLink: cut }).exec();
    return link; 
  }
  
}