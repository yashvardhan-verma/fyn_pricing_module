const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const distanceBasePriceSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  config_id: {
    type: mongoose.Types.ObjectId,
    ref: 'pricingConfiguration'
  },
  day_of_week: {
    type: String
  },
  max_distance: {
    type: Number
  },
  additional_price_per_km: {
    type: Number
  },
  price: {
    type: Number,
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
distanceBasePriceSchema.set('timestamps', true);
module.exports = mongoose.model("distanceBasePrice", distanceBasePriceSchema);