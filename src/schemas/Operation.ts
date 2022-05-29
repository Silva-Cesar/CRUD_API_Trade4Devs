import { model, Schema, Document } from 'mongoose';

export interface OperationInterface extends Document {
  sender: string;
  receiver: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const OperationSchema = new Schema({
  sender: {
    type: String,
    required: [true, 'Sender is required']
  },
  receiver: {
    type: String,
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
