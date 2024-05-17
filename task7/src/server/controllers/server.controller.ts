import { Controller, Get, Post } from '@nestjs/common';
import { ServerService } from '../services/server.service';

@Controller({ path: '/orders' })
export class AppController {
  constructor(private readonly serverService: ServerService) {}

  @Post('/')
  createOrder(): Promise<void> {
    return this.serverService.createOrder();
  }
}
