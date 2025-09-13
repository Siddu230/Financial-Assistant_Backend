const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Create transaction (existing)
router.post('/', auth, async (req, res) => {
  try {
    const { amount, type, category, date, description } = req.body;
    if (typeof amount !== 'number' || !['income','expense'].includes(type)) {
      return res.status(400).json({ message: 'Invalid payload' });
    }
    const tx = new Transaction({
      userId: req.user._id,
      amount,
      type,
      category: category || 'uncategorized',
      date: date ? new Date(date) : new Date(),
      description
    });
    await tx.save();
    res.json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List transactions (existing)
router.get('/', auth, async (req, res) => {
  try {
    const { from, to, page = 1, limit = 10, type, category } = req.query;
    const q = { userId: req.user._id };
    if (from || to) {
      q.date = {};
      if (from) q.date.$gte = new Date(from);
      if (to) q.date.$lte = new Date(to);
    }
    if (type && ['income','expense'].includes(type)) q.type = type;
    if (category) q.category = category;
    const pageNum = Math.max(1, parseInt(page));
    const lim = Math.max(1, Math.min(100, parseInt(limit)));
    const total = await Transaction.countDocuments(q);
    const txs = await Transaction.find(q)
      .sort({ date: -1 })
      .skip((pageNum - 1) * lim)
      .limit(lim)
      .lean();
    res.json({ total, page: pageNum, limit: lim, data: txs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a transaction (new)
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    // find the transaction and ensure it belongs to the logged-in user
    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    if (tx.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this transaction' });
    }
    await tx.deleteOne();
    res.json({ message: 'Transaction deleted', id });
  } catch (err) {
    console.error('Delete transaction error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
