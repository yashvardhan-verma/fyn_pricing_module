const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  jwtToken: [],
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});
userSchema.set('timestamps', true);
module.exports = mongoose.model("user", userSchema);