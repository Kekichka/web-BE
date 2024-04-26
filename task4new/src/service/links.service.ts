import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateLinkDto } from '../models';

@Injectable()
export class LinksService {
  private readonly links = [];

  createLink(createLinkDto: CreateLinkDto) {
    const linkId = uuidv4();
    const { originalLink, shortLink, expiredAt } = createLinkDto;

    const link = {
      linkId,
      originalLink,
      shortLink,
      expiredAt,
    };

    this.links.push(link);
    return link;
  }
}
