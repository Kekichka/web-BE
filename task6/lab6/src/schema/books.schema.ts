import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';


interface PageLink {
  pageLink: string;
}

@Schema({ collection: 'Books' })
export class Books {
  @Prop({ type: Number, required: true })
  pageNumber: number;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Object, required: true })
  pageLinks: PageLink[];

  @Prop({ required: true })
  userId?: string;
}

export const BooksSchema = SchemaFactory.createForClass(Books);

export type BooksLeanDoc = Books & { _id: Types.ObjectId };
export type BooksDoc = Books & Document;
