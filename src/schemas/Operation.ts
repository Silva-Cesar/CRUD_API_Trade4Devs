import { model, Schema, Document } from 'mongoose';

export interface OperationInterface extends Document {
  sender: number;
  receiver: number;
  value: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
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
  deletedAt: {
    type: Date,
    default: null
  }
},
{
  timestamps: true
});

export default model<OperationInterface>('Operation', OperationSchema);
