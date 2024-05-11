import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ collection: 'Books' }) 
export class Book {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: [{ type: String }] }) 
  pageLinks: string[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  apiKey: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);

export type BookLeanDoc = Book & { _id: Types.ObjectId };
export type BookDoc = Book & Document;
