import { model, Schema, Document } from 'mongoose';

export interface BalanceInterface extends Document {
  cpf: number;
  saldo: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;  
}

const BalanceSchema = new Schema({
  cpf: {
    type: Number,
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
