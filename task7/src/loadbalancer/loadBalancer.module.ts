import { Module } from '@nestjs/common';
import { LoadBalancerController } from './loadBalancer.controller';
import { LoadBalancerService } from './loadBalancer.service';

@Module({
  imports: [],
  controllers: [LoadBalancerController],
  providers: [LoadBalancerService],
})
export class LoadBalancerModule {}
