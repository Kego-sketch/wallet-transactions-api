const express = require('express')
const store = require('./lib/store');

const app = express();
app.use(express.json());

const errorStatus = {
  WALLET_NOT_FOUND: 404,
  INVALID_AMOUNT: 400,
  INVALID_TYPE: 400,
  INSUFFICIENT_FUNDS: 422
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.post('/wallets', (req, res) => {
  const { owner } = req.body || {};
  if (!owner || typeof owner !== 'string') {
    return res.status(400).json({ error: 'owner is required and must be a string' });
  }
  const wallet = store.createWallet(owner);
  res.status(201).json(wallet);
});

app.get('/wallets/:id', (req, res) => {
  const wallet = store.getWallet(req.params.id);
  if (!wallet) return res.status(404).json({ error: 'wallet not found' });
  res.json(wallet);
});

app.post('/transactions', (req, res) => {
  const { walletId, type, amount } = req.body || {};
  try {
    const tx = store.recordTransaction(walletId, type, amount);
    res.status(201).json(tx);
  } catch (err) {
    const status = errorStatus[err.message] || 500;
    res.status(status).json({ error: err.message });
  }
});

app.get('/transactions/:walletId', (req, res) => {
  const wallet = store.getWallet(req.params.walletId);
  if (!wallet) return res.status(404).json({ error: 'wallet not found' });
  res.json(store.listTransactions(req.params.walletId));
});

module.exports = app;
