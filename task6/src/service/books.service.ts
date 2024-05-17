import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from '../schema';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async createBook(title: string, pageLinks: { pageLink: string }[]): Promise<Book> {
    const createdBook = new this.bookModel({ title, pageLinks });
    return createdBook.save();
  }

  async getBooks(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }
}
