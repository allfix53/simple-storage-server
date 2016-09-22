import mongoose from 'mongoose';

export default callback => {
  mongoose.connect('mongodb://128.199.132.217/storage', function(err) {
    if(err) throw err;
    callback()
  });
}
