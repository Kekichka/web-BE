import { BadRequestException, Body, Controller, Post, Headers, Get } from '@nestjs/common';
import { BooksService } from '../service';
import { BooksDto } from '../models';
@Controller({ path: '/books' })
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
  ) {}

  @Post('/')
  async createBook(
    @Body() body: BooksDto,
    @Headers('authorization') id: string,
  ) {
    try {
      const result = await this.booksService.createBook(id, body); 
      return result;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('/')
  async getBooks(@Headers('authorization') token: string) {
    try {
      const books = await this.booksService.getBooksByUser(token);
      return books;
    } catch (err) {
      throw new BadRequestException('Failed to fetch books');
    }
  }
}
