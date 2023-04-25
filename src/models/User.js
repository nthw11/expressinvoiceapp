import mongoose, { Schema as _Schema } from 'mongoose'

const Schema = _Schema

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 4,
    maxLength: 24,
  },

  email: { type: String, required: true, unique: true },
  userInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    address: {
      streetAddress: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
    },
  },
  password: { type: String, required: true, minLength: 6 },
  invoices: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }],
})

export default mongoose.model('User', UserSchema)