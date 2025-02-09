import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
@ObjectType({ isAbstract: true })
export class AbstractEntity {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({ type: Boolean, default: false, index: true })
  @Field(() => Boolean, { defaultValue: false })
  isDeleted: boolean;

  @Prop({ type: SchemaTypes.Date, default: null })
  @Field(() => Date, { nullable: true })
  deletedAt: Date;
}
