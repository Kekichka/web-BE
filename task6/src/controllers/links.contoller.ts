import { BadRequestException, Body, Controller, Get, Headers, NotFoundException, Param, Post, Query, Res, UnauthorizedException } from '@nestjs/common';
import { BooksService } from '../service'; // Assuming you have a BooksService
import { CreateBookDto } from '../models'; // Assuming you have a CreateBookDto
import { BookDoc } from '../schema'; // Assuming you have a Book schema

@Controller({ path: '/books' }) // Changed path to '/books'
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
