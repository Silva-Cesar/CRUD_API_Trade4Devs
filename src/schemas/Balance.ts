import { model, Schema, Document } from 'mongoose';

export interface BalanceInterface extends Document {
  name: string;
  cpf: string;
  saldo: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;  
}

const BalanceSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  cpf: {
    type: String,
    unique: true,
    required: [true, 'ID number is required']
  },
  saldo: {
    type: Number
  },
  deletedAt: {
    type: Date,
    default: null
  }
},
{
  timestamps: true
})

export default model<BalanceInterface>('Balance', BalanceSchema);
