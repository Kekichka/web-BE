import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ collection: 'PartAccessToken' })
export class PartAccessToken {
  @Prop({ type: String, required: true })
  partId: string;

  @Prop({ type: String, required: true })
  key: string;
}

export const PartAccessTokenSchema = SchemaFactory.createForClass(PartAccessToken);

export type PartAccessTokenLeanDoc = PartAccessToken & { _id: Types.ObjectId };
export type PartAccessTokenDoc = PartAccessToken & Document;
