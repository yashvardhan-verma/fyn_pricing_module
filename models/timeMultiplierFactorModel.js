const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const timeMultiplierFactorSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  config_id: {
    type: mongoose.Types.ObjectId,
    ref: 'pricingConfiguration'
  },
  start_time_in_hours: {
    type: Number
  },
  end_time_in_hours: {
    type: Number
  },
  multiplier: {
    type: Number
  },
  created_by: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },
  updated_by: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  }
});
timeMultiplierFactorSchema.set('timestamps', true);
module.exports = mongoose.model("timeMultiplierFactor", timeMultiplierFactorSchema);