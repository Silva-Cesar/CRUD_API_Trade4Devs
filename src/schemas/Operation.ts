import { model, Schema, Document } from 'mongoose';

export interface OperationInterface extends Document {
  remetente: number;
  destinatario: number;
  value: number;
  creat_At: Date;
}

const OperationSchema = new Schema({
  remetente: {
    type: Number,
    required: [true, 'Remetente is required']
  },
  destinatario: {
    type: Number,
    required: [true, 'Destinatário is required']
  },
  value: {
    type: Number,
    required: [true, 'Value is required']
  },
  creat_At: {
    type: Date,
    default: Date.now
  }
});

export default model<OperationInterface>('Operation', OperationSchema);
