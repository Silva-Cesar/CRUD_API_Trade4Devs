import { model, Schema, Document } from 'mongoose';

export interface UserInterface extends Document {
  nome: string;
  dtNasc: string;
  cpf: number;
  email: string;
  telefone: string;
  senha: string;
  creat_At: Date;
}

const UserSchema = new Schema({
  nome: {
    type: String,
    required: [true, 'Name is required']
  },
  dtNasc: {
    type: String,
    required: [true, 'Birth date is required']
  },
  cpf: {
    type: Number,
    unique: true,
    required: [true, 'ID number is required']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'E-mail is required']
  },
  telefone: {
    type: String,
    unique: true
  },
  senha: {
    type: String,
    required: [true, 'Password is required']
  },
  creat_At: {
    type: Date,
    default: Date.now
  }
})

export default model<UserInterface>('User', UserSchema);
