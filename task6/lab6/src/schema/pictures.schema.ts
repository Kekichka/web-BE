import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ collection: 'Pictures' })
export class Pictures {
  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, required: true })
  documentId?: string;

  @Prop({ type: Number, required: false })
  pageNumber: number;

  @Prop({ type: Number, required: false })
  totalCount: number;
}

export const PicturesSchema = SchemaFactory.createForClass(Pictures);

export type PicturesLeanDoc = Pictures & { _id: Types.ObjectId };
export type PicturesDoc = Pictures & Document;
