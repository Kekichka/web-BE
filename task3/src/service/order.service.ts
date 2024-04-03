import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDto } from '../models';
import { Orders, OrdersDoc } from '../schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Orders.name)
    private readonly orderModel: Model<OrdersDoc>,
  ) {}

  async createOrder(body: OrderDto & { login: string }) {
    try {
      const price = 50;

      const doc = new this.orderModel({
        ...body,
        price,
      });

      const order = await doc.save();

      return order;
    } catch (error) {
      throw new Error('Failed to create order');
    }
  }

  async getLast5Addresses(userLogin: string): Promise<string[]> {
    try {
      const orders = await this.orderModel.find({ login: userLogin }).exec();
      const addresses = [...new Set(orders.map(order => order.from))];
      return addresses.slice(-5);
    } catch (error) {
      throw new Error('Failed to get last 5 addresses');
    }
  }
  
  async getLast3Addresses(userLogin: string): Promise<string[]> {
    try {
      const orders = await this.orderModel.find({ login: userLogin }).exec();
      const addresses = [...new Set(orders.map(order => order.to))];
      return addresses.slice(-3);
    } catch (error) {
      throw new Error('Failed to get last 3 addresses');
    }
  }


async getLowestPriceOrder(login: string): Promise<OrderDto> {
  try {
    const orders = await this.orderModel.find({ login });
    if (orders.length === 0) {
      return null; 
    }
    const lowestPriceOrder = orders.reduce((lowest, order) => {
      return order.price < lowest.price ? order : lowest;
    });
    return lowestPriceOrder.toObject(); 
  } catch (error) {
    throw error;
  }
}

async getBiggestPriceOrder(login: string): Promise<OrderDto> {
  try {
    const orders = await this.orderModel.find({ login });
    if (orders.length === 0) {
      return null; 
    }
    const biggestPriceOrder = orders.reduce((lowest, order) => {
      return order.price > lowest.price ? order : lowest;
    });
    return biggestPriceOrder.toObject(); 
  } catch (error) {
    throw error;
  }
}
}