const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const distanceAdditionalPriceSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  config_id: {
    type: mongoose.Types.ObjectId,
    ref: 'pricingConfiguration'
  },
  max_distance: {
    type: Number
  },
  price_per_km: {
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
distanceAdditionalPriceSchema.set('timestamps', true);
module.exports = mongoose.model("distanceAdditionalPrice", distanceAdditionalPriceSchema);