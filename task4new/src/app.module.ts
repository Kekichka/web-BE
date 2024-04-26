import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { LinksService, UserService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, Users } from './schema';
import { UserAuthorizationMiddleware } from './midellware/userAuthorization.middleware';
import { LinksController } from './controllers/links.contoller';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://katekya:aTG633DYxp0GBhJI@lab4.hv8gbof.mongodb.net/?retryWrites=true&w=majority&appName=Lab4',
      { dbName: 'Meow' },
    ),
    MongooseModule.forFeature([
      { name: Users.name, schema: UserSchema },

    ]),
  ],
  controllers: [UsersController,LinksController],
  providers: [UserService, LinksService ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthorizationMiddleware).forRoutes('orders');
  }
}
