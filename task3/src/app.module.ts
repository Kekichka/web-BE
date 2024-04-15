import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdminController, DriverController, UsersController } from './controllers/users.controller';
import { UserService } from './service/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Addresses, AddressesSchema, Orders, OrdersSchema, UserSchema, Users } from './schema';
import { UserAuthorizationMiddleware } from './midellware/userAuthorization.middleware';
import { OrdersController } from './controllers/orders.controller';
import { AddressesService, OrderService } from './service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://katekya:3Q8jufM0y7n3fZYJ@cluster1.jglyg7q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1',
      { dbName: 'Cluster1' },
    ),
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UserSchema,
      },
      {
        name: Orders.name,
        schema: OrdersSchema,
      },
      {
        name: Addresses.name,
        schema: AddressesSchema
      }
    ]),
  ],
  controllers: [UsersController, OrdersController, AdminController,DriverController],
  providers: [UserService, OrderService, AddressesService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthorizationMiddleware).forRoutes('/orders');
  }
}