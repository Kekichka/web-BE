import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { BooksService , UserService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema, Book , UserSchema, Users } from './schema';
import { UserAuthorizationMiddleware } from './midellware/userAuthorization.middleware';
import { BooksController} from './controllers/links.contoller';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://katekya:aTG633DYxp0GBhJI@lab4.hv8gbof.mongodb.net/?retryWrites=true&w=majority&appName=Lab4',
      { dbName: 'Meow' },
    ),
    MongooseModule.forFeature([
      { name: Users.name, schema: UserSchema },
      { name: Book.name, schema: BookSchema },
    ]),
  ],
  controllers: [UsersController, BooksController],
  providers: [UserService, BooksService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthorizationMiddleware).forRoutes('orders');
  }
}
