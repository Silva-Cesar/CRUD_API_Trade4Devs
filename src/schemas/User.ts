import { model, Schema, Document } from 'mongoose';

export interface UserInterface extends Document {
  name: string;
  email: string;
  age: number;
  phone: number;
  creation: Date;
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'E-mail is required']
  },
  age: {
    type: Number,
    required: [true, 'Age is required']
  },
  phone: {
    type: Number
  },
  creation: {
    type: Date,
    default: Date.now
  }
})

export default model<UserInterface>('User', UserSchema);
