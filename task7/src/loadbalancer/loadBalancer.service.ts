import { Injectable } from '@nestjs/common';

@Injectable()
export class LoadBalancerService {
  getHello(): string {
    return 'Hello World!';
  }
}
