import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { AbstractEntity } from '../../shared/database/abstract.entity';

@Schema({
  versionKey: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
    transform: (_, ret) => {
      delete ret.__v;
      return ret;
    },
  },
})
@ObjectType()
export class User extends AbstractEntity {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  @Field(() => String)
  email: string;

  @Prop({ required: true, trim: true })
  @Field(() => String)
  fullName: string;

  @Prop({ required: true, trim: true })
  @Field(() => String)
  userName: string;

  @Prop({ required: true })
  @Field(() => String)
  password: string;

  @Prop({ default: false })
  @Field(() => Boolean)
  isEmailVerified: boolean;

  @Prop({ default: null })
  @Field(() => Date, { nullable: true })
  lastLoginAt?: Date;
}
