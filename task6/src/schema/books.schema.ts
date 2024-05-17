import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PageLink {
  @Prop({ required: true })
  pageLink: string;
}

@Schema()
export class Book extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [PageLink], required: true })
  pageLinks: PageLink[];
}

export const BookSchema = SchemaFactory.createForClass(Book);
