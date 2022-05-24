import { model, Schema, Document } from 'mongoose';

export interface ProductInterface extends Document {
  name: string;
  description: string;
  quantity: number;
  price: number;
  creat_At: Date;
}

const ProductSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Name is required']
  },
  description: {
    type: String
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  creat_At: {
    type: Date,
    default: Date.now
  }
});

export default model<ProductInterface>('Product', ProductSchema);
