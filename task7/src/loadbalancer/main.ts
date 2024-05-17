import { NestFactory } from '@nestjs/core';
import { LoadBalancerModule } from './loadBalancer.module';

async function bootstrap() {
  const app = await NestFactory.create(LoadBalancerModule);
  await app.listen(3000);
}
bootstrap();
