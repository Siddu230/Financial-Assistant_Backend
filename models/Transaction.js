const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income','expense'], required: true },
  category: { type: String, default: 'uncategorized' },
  date: { type: Date, default: Date.now },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
