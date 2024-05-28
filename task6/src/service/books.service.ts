  import { Injectable, BadRequestException } from '@nestjs/common';
  import { Model } from 'mongoose';
  import { InjectModel } from '@nestjs/mongoose';
  import { Books, BooksDoc, Pictures, PicturesDoc } from 'src/schema';
  import { BooksDto, PicturesDto } from 'src/models';

  @Injectable()
  export class BooksService {

    constructor(
      @InjectModel(Books.name)
      private readonly booksModel: Model<BooksDoc>,
      @InjectModel(Pictures.name)
      private readonly picturesModel: Model<PicturesDoc>,
    ) {}

    async createBook(id: string, body: BooksDto) {
      try {
        if (!body.title || !body.pageLinks || body.pageLinks.length === 0) {
          throw new BadRequestException('Title and pageLinks are required.');
        }

        const doc = new this.booksModel({
          ...body,
          userId: id
        });

        const book = await doc.save();

        const savedPictures = [];

        for (let i = 0; i < body.pageLinks.length; i++) {
          const pageLink = body.pageLinks[i];
          const pictureData: PicturesDto = {
            url: pageLink.pageLink,
            documentId: book._id,
            pageNumber: i + 1,
            totalCount: body.pageLinks.length
          };
          const savedPicture = await this.createPicture(pictureData);
          savedPictures.push(savedPicture.toObject());
        }

        return { book: book.toObject(), pictures: savedPictures };
      } catch (err) {
        console.error(`Failed to create book: ${err.message}`);
        throw new BadRequestException('Failed to create book');
      }
    }

    async createPicture(picture: PicturesDto): Promise<PicturesDoc> {
      try {
        const pictureDoc = new this.picturesModel({
          ...picture
        });
        return await pictureDoc.save();
      } catch (err) {
        console.error(`Failed to create picture: ${err.message}`);
        throw new BadRequestException('Failed to create picture');
      }
    }

    async getBooksByUser(id: string) {
      try {
        const books = await this.booksModel.find({ userId: id }).exec();
        return books;
      } catch (err) {
        console.error(`Failed to fetch books: ${err.message}`);
        throw new BadRequestException('Failed to fetch books');
      }
    }
  }
