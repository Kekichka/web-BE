import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ collection: 'Users' })
export class Users {
  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  apiKey: string;

}

export const UserSchema = SchemaFactory.createForClass(Users);

export type UserLeanDoc = Users & { _id: Types.ObjectId };
export type UserDoc = Users & Document;