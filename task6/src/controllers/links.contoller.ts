import { BadRequestException, Body, Controller, Get, Headers, NotFoundException, Param, Post, Query, Res, UnauthorizedException } from '@nestjs/common';
import { LinksService } from '../service';
import { CreateLinkDto } from '../models';
import { LinksDoc } from '../schema';

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
      const createdLink = await this.linksService.createLink(apiKey, {
        originalLink: body.originalLink,
        shortLink,
        expiredAt,
      });

      return { shortLink: createdLink.shortLink, expiredAt };
    } catch (error) {
      throw new BadRequestException('Failed to create link');
    }
  }

  @Get('/links')
async GetLinks(
  @Headers('authorization') apiKey: string,
  @Query('expiredAt[gt]') gtExpiredAt: Date,
  @Query('expiredAt[lt]') ltExpiredAt: Date,
): Promise<any> {
  if (!apiKey) {
    throw new UnauthorizedException('User is not authorized');
  }

  try {
    return await this.linksService.getLinks(apiKey, gtExpiredAt, ltExpiredAt);
  } catch (error) {
    throw new BadRequestException('Failed to retrieve links');
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

  @Get('shortLink/:cut')
  async handleRedirect(@Res() res, @Param('cut') cut: string) {
    try {

      const shortLink = await this.linksService.getOriginalLink( cut);

      if (!shortLink) {
        throw new NotFoundException('Short link was not found');
      }

      if (shortLink.expiredAt && shortLink.expiredAt < new Date()) {
        throw new NotFoundException('Link was expired');
      }

      res.redirect(shortLink.originalLink);
    } catch (err) {
      if (err instanceof UnauthorizedException || err instanceof NotFoundException) {
        throw err;
      } else {
        throw new BadRequestException('Failed to redirect');
      }
    }
  }
}
