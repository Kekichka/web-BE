import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

interface Coordinates {
    x: number;
    y: number;
    width: number;
    height: number;
  }

@Schema({ collection: 'Parts' })
export class Parts {
  @Prop({ type: String, required: true })
  picturesId: string;

  @Prop({ type: String, required: true })
  imageUrl: string;

  @Prop({ type: String, required: true })
  otp: string;

  @Prop({ type: Object, required: true })
  box: Coordinates;

}

export const PartsSchema = SchemaFactory.createForClass(Parts);

export type PartsLeanDoc = Parts & { _id: Types.ObjectId };
export type PartsDoc = Parts & Document;
