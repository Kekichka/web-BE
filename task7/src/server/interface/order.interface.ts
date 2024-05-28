import { Document } from 'mongoose';

export interface Order extends Document {
  customerName: string;
  product: string;
  quantity: number;
  price: number;
  status: string;
  createdAt: Date;
}
