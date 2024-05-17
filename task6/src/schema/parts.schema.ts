import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Part extends Document {
  @Prop()
  imageUrl: string;

  @Prop()
  otp: string;

  @Prop()
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const PartSchema = SchemaFactory.createForClass(Part);
