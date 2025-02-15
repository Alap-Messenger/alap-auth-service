import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { userMethods } from './schemas/user.schema.methods';
import { userMiddleware } from './schemas/user.schema.middleware';
import { UsersResolver } from './resolvers/users.resolver';
import { UsersRepository } from './repositories/users.repository';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = SchemaFactory.createForClass(User);

          schema.methods.getUserName = userMethods.getFullName;
          schema.methods.comparePassword = userMethods.comparePassword;

          userMiddleware(schema);

          return schema;
        },
      },
    ]),
  ],
  providers: [UsersResolver, UsersService, UsersRepository],
})
export class UsersModule {}
