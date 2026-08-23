import mongoose from 'mongoose';

const PriceBaselineSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
    },
    historicalAveragePrice: {
      type: Number,
      required: true,
    },
    lastPurchasedPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.PriceBaseline ||
  mongoose.model('PriceBaseline', PriceBaselineSchema);
