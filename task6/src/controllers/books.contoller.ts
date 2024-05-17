import { Controller, Post, Get, Body } from '@nestjs/common';
import { BooksService } from '../service';
import { CreateBookDto } from '../models';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.booksService.createBook(createBookDto.title, createBookDto.pageLinks);
  }

  @Get('/user-books')
  getUserBooks() {
    return this.booksService.getBooks();
  }
}
