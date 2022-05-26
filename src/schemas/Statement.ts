import { model, Schema, Document, ObjectId } from 'mongoose';

export interface StatementInterface extends Document {
  cpf: Number;
  month: Number;
  year: Number;
  operations: [ ObjectId ];  
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const StatementSchema = new Schema({
  cpf: {
    type: Number,
    //min: 11,
    //max: 12,
    required: [true, 'CPF is required']
  },
  month: {
    type: Number,
    //min: 1,
    //max: 12,
    required: [true, 'Month is required']
  },
  year: {
    type: Number,
    required: [true, 'Year is required']
  },
  operations : [{
     type : Schema.Types.ObjectId, ref: 'Operation', 
   required: [true, 'At least one operation is required'] 
  }],
  deletedAt: {
    type: Date,
    default: null
  }
},
{
  timestamps: true
});

export default model<StatementInterface>('Statement', StatementSchema);
