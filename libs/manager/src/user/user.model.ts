import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USER_ROLE_ENUM } from 'als/building-block/utils/enum';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type UserModelDocument = HydratedDocument<UserModel>;

@Schema()
export class UserModel {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  @Prop({
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (v: unknown) {
        const count = await this.constructor.countDocuments({
          username: v,
        });

        return count === 0;
      },
      message: 'Username already exist.',
    },
  })
  username: string;

  @AutoMap()
  @Prop({
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (v: unknown) {
        const count = await this.constructor.countDocuments({
          email: v,
        });

        return count === 0;
      },
      message: 'Email already exist.',
    },
  })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @AutoMap()
  @Prop({ type: String })
  phone_number: string;

  @AutoMap()
  @Prop({ type: String, enum: USER_ROLE_ENUM, default: USER_ROLE_ENUM.ADMIN })
  role: string;

  @AutoMap()
  @Prop({ type: String })
  first_name: string;

  @AutoMap()
  @Prop({ type: String })
  last_name: string;

  @AutoMap()
  @IsNotEmpty()
  @Prop({
    required: true,
    type: String,
    default:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrOoRit4Bt6C-dwz_WixUYxhpkc_L9jCI1Vw&usqp=CAU',
  })
  img_url: string;

  @AutoMap()
  @IsBoolean()
  @Prop({ type: Boolean, default: false })
  is_deleted: boolean;
}

export const UserModelSchema = SchemaFactory.createForClass(UserModel);
