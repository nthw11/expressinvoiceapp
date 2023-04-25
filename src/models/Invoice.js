import mongoose, { Schema as _Schema } from 'mongoose'

const Schema = _Schema
const InvoiceSchema = new Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  invoiceDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  items: [
    {
      item: { type: String, required: true },
      date: { type: Date, required: true },
      description: { type: String },
      quantity: { type: Number, required: true },
      rate: { type: Number, required: true },
      amount: { type: Number, required: true },
    },
  ],


  total: { type: Number, required: true },
  status: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
})

export default mongoose.model('Invoice', InvoiceSchema)