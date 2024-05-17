import { Controller, Get } from '@nestjs/common';
import { LoadBalancerService } from './loadBalancer.service';

@Controller()
export class LoadBalancerController {
  constructor(private readonly loadBalancerService: LoadBalancerService) {}

  @Get()
  getHello(): string {
    return this.loadBalancerService.getHello();
  }
}
