import { HttpException } from '@nestjs/common';
import { UserDocument } from './user.document';
import * as bcrypt from 'bcryptjs';

export const userMethods = {
  getFullName(this: UserDocument): string {
    if (!this.fullName)
      throw new HttpException('User name cannot be empty!', 400);

    return `@${this.fullName?.trim().replace(/\s+/g, '-')}`;
  },

  async comparePassword(
    this: UserDocument,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(userPassword, this.password);
  },
};
