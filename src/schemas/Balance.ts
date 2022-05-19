import { model, Schema, Document } from 'mongoose';

export interface BalanceInterface extends Document {
  cpf: number;
  saldo: number;
}

const BalanceSchema = new Schema({
  cpf: {
    type: Number,
    unique: true,
    required: [true, 'ID number is required']
  },
  saldo: {
    type: parseFloat(Number.prototype.toFixed(2))
  },
})

export default model<BalanceInterface>('User', BalanceSchema);