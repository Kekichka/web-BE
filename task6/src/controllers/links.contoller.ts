import { BadRequestException, Body, Controller, Get, Headers, NotFoundException, Param, Post, UnauthorizedException } from '@nestjs/common';
import { BooksService } from '../service'; 
import { CreateBookDto } from '../models';
import { BookDoc } from '../schema'; 

@Controller({ path: '/books' }) 
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('/')
  async createBook(@Body() body: CreateBookDto, @Headers('authorization') apiKey: string) {
    if (!apiKey) {
      throw new UnauthorizedException('User is not authorized');
    }

    try {
      const createdBook = await this.booksService.createBook(apiKey, {
        title: body.title,
        pageLinks: body.pageLinks,
      });

      return createdBook;
    } catch (error) {
      throw new BadRequestException('Failed to create book');
    }
  }

  @Get('/')
  async getBooks(@Headers('authorization') apiKey: string): Promise<BookDoc[]> {
    if (!apiKey) {
      throw new UnauthorizedException('User is not authorized');
    }

    try {
      return await this.booksService.getBooks(apiKey);
    } catch (error) {
      throw new BadRequestException('Failed to retrieve books');
    }
  }
}
