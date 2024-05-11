import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { LinksService, UserService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { Links, LinksSchema, UserSchema, Users } from './schema';
import { UserAuthorizationMiddleware } from './midellware/userAuthorization.middleware';
import { LinksController } from './controllers/links.contoller';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://katekya:86zJkTToG8e7BWuA@lab4.hv8gbof.mongodb.net/?retryWrites=true&w=majority&appName=Lab4',
      { dbName: 'Meow' },
    ),
    MongooseModule.forFeature([
      { name: Users.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthorizationMiddleware).forRoutes('orders');
  }
}
