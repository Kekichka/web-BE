import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { OrderService } from '../service';
import { OrderDto } from '../models';
import { UserLeanDoc } from '../schema';
import { Request, Response } from 'express'; 

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() body: OrderDto,
    @Req() req: Request & { user: UserLeanDoc }
  ) {
    try {
      const { user } = req;
      return this.orderService.createOrder({
        ...body,
        login: user.login,
      });
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  @Get('address/from/last-5')
  async getLast5Addresses(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const { user } = req;
      return this.orderService.getLast5Addresses(user.login);
    } catch (error) {
      console.error('Error getting last 5 addresses:', error);
      throw error; 
    }
  }

  @Get('address/to/last-3')
  async getLast3Addresses(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const { user } = req;
      return this.orderService.getLast3Addresses(user.login);
    } catch (error) {
      console.error('Error getting last 3 addresses:', error);
      throw error; 
    }
  }

  @Get('/lowest')
  async getLowestPriceOrder(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const { user } = req;
      return this.orderService.getLowestPriceOrder(user.login);
    } catch (error) {
      console.error('Error getting lowest order', error);
      throw error; 
    }
  }

  @Get('/biggest')
  async getBiggestPriceOrder(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const { user } = req;
      return this.orderService.getBiggestPriceOrder(user.login);
    } catch (error) {
      console.error('Error getting biggest order', error);
      throw error; 
    }
  }
}


