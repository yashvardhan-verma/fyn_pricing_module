const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const waitingChargesSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  config_id: {
    type: mongoose.Types.ObjectId,
    ref: 'pricingConfiguration'
  },
  initial_waiting_time: {
    type: Number
  },
  charge_per_unit_time: {
    type: Number
  },
  time_multiplier: {
    type: Number
  },
  created_by: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  }, 
  updated_by:{
    type: mongoose.Types.ObjectId,
    ref: 'user'
  }
});
waitingChargesSchema.set('timestamps', true);
module.exports = mongoose.model("waitingCharges", waitingChargesSchema);