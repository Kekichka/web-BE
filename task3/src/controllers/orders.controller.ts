import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { OrderService } from '../service';
import { OrderDto } from '../models';
import { UserLeanDoc } from '../schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() body: OrderDto,
    @Req() req: Request & { user: UserLeanDoc },
  ) {
    try {
      const { user } = req;
      const order = await this.orderService.createOrder({
        ...body,
        login: user.login,
      });
      return { message: 'Order created successfully', order };
    } catch (err) {
      throw err;
    }
  }

  @Get()
  async getOrders(@Req() req: Request & { user: { login: string; role: string } }) {
    const { login, role } = req.user;
    return this.orderService.getOrders(login, role);
  }

  @Patch('/:orderId')
  async updateOrderStatus(
    @Body() body: { status: string },
    @Req() req: Request & { params: { orderId: string }; user: { role: string } },
  ) {
    try {
      const { params, user } = req;
      const result = await this.orderService.updateOrderStatus(
        params.orderId,
        body.status,
        user.role,
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  @Get('addresses/from/last-5')
  async getLast5FromAddresses(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const { user } = req;
      const last5Addresses = await this.orderService.getLast5FromAddresses(user.login);
      return last5Addresses;
    } catch (err) {
      throw err;
    }
  }

  @Get('addresses/to/last-3')
  async getLast3ToAddresses(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const { user } = req;
      const last3Addresses = await this.orderService.getLast3ToAddresses(user.login);
      return last3Addresses;
    } catch (err) {
      throw err;
    }
  }

  @Get('lowest')
  async getLowestPriceOrder(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const { user } = req;
      const lowestPriceOrder = await this.orderService.getLowestPriceOrder(user.login);
      return lowestPriceOrder;
    } catch (err) {
      throw err;
    }
  }

  @Get('biggest')
  async getBiggestPriceOrder(@Req() req: Request & { user: UserLeanDoc }) {
    try {
      const { user } = req;
      const biggestPriceOrder = await this.orderService.getBiggestPriceOrder(user.login);
      return biggestPriceOrder;
    } catch (err) {
      throw err;
    }
  }
}