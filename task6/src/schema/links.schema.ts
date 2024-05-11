import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ collection: 'Links' })
export class Links {
  @Prop({ type: String, required: true })
  originalLink: string;

  @Prop({ type: String, required: true })
  shortLink: string;

  @Prop({ type: Date, required: true })
  expiredAt: Date;

  @Prop({ required: true })
  apiKey: string;
}

export const LinksSchema = SchemaFactory.createForClass(Links);

export type LinksLeanDoc = Links & { _id: Types.ObjectId };
export type LinksDoc = Links & Document;
