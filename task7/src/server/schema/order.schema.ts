import { Schema } from 'mongoose';

export const OrderSchema = new Schema({
  customerName: String,
  product: String,
  quantity: Number,
  price: Number,
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
