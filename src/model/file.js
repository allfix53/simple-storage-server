import mongoose from 'mongoose';

let fileSchema = {
  files: {
    type: Array,
    required: true
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

export default mongoose.model('xFile', fileSchema);
