import mongoose from 'mongoose';

export default callback => {
  mongoose.connect('mongodb://localhost/storage', function(err) {
    if(err) throw err;
    callback()
  });
}
