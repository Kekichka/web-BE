import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export class Links {
  @Prop({ type: String, required: true })
  originalLink: string;

  @Prop({ type: String, required: true })
  shortLink: string;

  @Prop({ type: Date, required: true })
  expiredAt: Date;
}

export const LinksSchema = SchemaFactory.createForClass(Links);

export type LinksLeanDoc = Links & { _id: Types.ObjectId };
export type LinksDoc = Links & Document;
