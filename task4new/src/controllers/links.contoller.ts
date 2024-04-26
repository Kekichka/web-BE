import { BadRequestException, Body, Controller, Post, Headers, UnauthorizedException } from '@nestjs/common';
import { LinksService } from '../service';
import { CreateLinkDto } from '../models';

@Controller({ path: '/link' })
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post('/')
  async CreateLinksObject(@Body() body: CreateLinkDto, @Headers('authorization') apiKey: string) {
    if (!apiKey) {
      throw new UnauthorizedException('User is not authorized');
    }

    const shortLink = this.generateShortLink();
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 5);

    try {
      const createdLink = await this.linksService.createLink({
        originalLink: body.originalLink,
        shortLink,
        expiredAt,
      });

      return { shortLink: createdLink.shortLink, expiredAt };
    } catch (error) {
      throw new BadRequestException('Failed to create link');
    }
  }

  private generateShortLink(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortLink = '';
    for (let i = 0; i < 15; i++) {
      shortLink += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return shortLink;
  }
}
