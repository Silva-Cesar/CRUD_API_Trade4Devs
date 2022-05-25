import { model, Schema, Document } from 'mongoose';

export interface OperationInterface extends Document {
  sender: number;
  receiver: number;
  value: number;
  creat_At: Date;
}

const OperationSchema = new Schema({
  sender: {
    type: Number,
    required: [true, 'Sender is required']
  },
  receiver: {
    type: Number,
    required: [true, 'Receiver is required']
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
