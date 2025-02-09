import { Schema } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export const userMiddleware = (schema: Schema) => {
  schema.pre('save', async function (next) {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = bcrypt.hashSync(this.password as string, salt);
    }
    next();
  });

  schema.pre('findOneAndUpdate', async function (next) {
    const update: any = this.getUpdate();
    if (update?.password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
    }
    next();
  });
};
