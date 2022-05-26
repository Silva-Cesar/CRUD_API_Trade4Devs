import { model, Schema, Document } from 'mongoose';

export interface RegisterInterface extends Document {
  name: string;
  email: string;
  phone: number;
  birth_date: Date;
  cpf: number;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const RegisterSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'E-mail is required']
  },
  phone: {
    type: Number,
    unique: true,
    required: [true, 'Phone is required']
  },
  birth_date: {
    type: Date,
    required: [true, 'Birth date is required']
  },
  cpf: {
    type: Number,
    unique: true,
    required: [true, 'CPF is required']
  },
  password: {
    type: String,
    required: [true, 'Name is required']
  },
  deletedAt: {
    type: Date,
    default: null
  }
},
{
  timestamps: true
});

export default model<RegisterInterface>('Register', RegisterSchema);
