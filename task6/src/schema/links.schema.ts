import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ collection: 'Books' }) // Assuming your collection name for books is 'Books'
export class Book {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: [{ type: String }] }) // Assuming pageLinks is an array of strings
  pageLinks: string[];

  @Prop({ type: Date, default: Date.now }) // Assuming you want to store creation date
  createdAt: Date;

  @Prop({ required: true })
  apiKey: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);

export type BookLeanDoc = Book & { _id: Types.ObjectId };
export type BookDoc = Book & Document;
