import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from 'src/shared/database/abstract.repository';
import { UserDocument } from './schemas/user.document';
import { User } from './schemas/user.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel, 'User');
  }
}
