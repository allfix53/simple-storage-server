import mongoose from 'mongoose';

let fileSchema = {
  name: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  created_at: {
    type: Date,
    default: new Date
  },
  updated_at: {
    type: Date,
    default: new Date
  }
}

export default mongoose.model('File', fileSchema);
