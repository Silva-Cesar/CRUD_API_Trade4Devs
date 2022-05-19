import { model, Schema, Document } from 'mongoose';

export interface OperationInterface extends Document {
  cpf: number;
  tipo: string;
  value: number;
  creation: Date;
}

const OperationSchema = new Schema({
  cpf: {
    type: Number,
    required: [true, 'CPF is required']
  },
  tipo: {
    type: String,
    required: [true, 'Type is required']
  },
  value: {
    type: Number,
    required: [true, 'Value is required']
  },
  creation: {
    type: Date,
    default: Date.now
  }
});

export default model<OperationInterface>('Operation', OperationSchema);
