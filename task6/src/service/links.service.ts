import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from '../models';
import { BookDoc, Book } from '../schema'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: Model<BookDoc>,
  ) {}

  async createBook(apiKey: string, body: CreateBookDto): Promise<BookDoc> {
    const book = new this.bookModel({
      title: body.title,
      pageLinks: body.pageLinks,
      apiKey: apiKey,
    });

    const createdBook = await book.save();
    return createdBook;
  }

  async getBooks(apiKey: string): Promise<BookDoc[]> {
    const query: any = { apiKey };

    return this.bookModel.find(query).exec();
  }

}
