const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const pricingConfigurationSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: {
    type: String,
    default: 'Standard'
  },
  description: {
    type: String,
    default: 'Standard pricing configuration',
  },
  enabled: {
    type: Boolean,
    default: true
  },
  start_date: {
    type: Date,
    default: Date.now
  },
  end_date: {
    type: Date,
    default: null
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
pricingConfigurationSchema.set('timestamps', true);
module.exports = mongoose.model("pricingConfiguration", pricingConfigurationSchema);