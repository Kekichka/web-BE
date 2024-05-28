import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UserService } from './service/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import {Books, BooksSchema, PartAccessToken, PartAccessTokenSchema, Parts, PartsSchema, Pictures, PicturesSchema, UserSchema, Users } from './schema';
import { UserAuthorizationMiddleware } from './midellware/userAuthorization.middleware';
import { BooksService, PartsService } from './service';
import { BooksController } from './controllers/books.controller';
import { PartsController } from './controllers/parts.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://viiboichuk:B6UL2BLRkKFFfejs@cluster0.7i5dsir.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      { dbName: 'Info' },
    ),
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UserSchema,
      },
      {
        name: Books.name,
        schema: BooksSchema,
      },
      {
        name: Pictures.name,
        schema: PicturesSchema,
      },
      {
        name: Parts.name,
        schema: PartsSchema,
      },
      {
        name: PartAccessToken.name,
        schema: PartAccessTokenSchema,
      }
    ]),
  ],
  controllers: [UsersController, BooksController, PartsController],
  providers: [UserService, BooksService, PartsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthorizationMiddleware).forRoutes('/orders');
  }
}
