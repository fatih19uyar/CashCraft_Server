import { prop, getModelForClass } from '@typegoose/typegoose';
import { v4 as uuidv4 } from 'uuid';

class UserClass {
    @prop({ required: true })
    name!: string;

    @prop({ required: true })
    phoneNumber!: string;

    @prop({ required: true })
    photo!: string;

    @prop({ required: true, unique: true })
    email!: string;

    @prop({ required: true, default: uuidv4, unique: true })
    uuid!: string;
}

const UserModel = getModelForClass(UserClass);

export default UserModel;
