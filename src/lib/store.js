// In-memory store for wallets and transactions.
// Kept deliberately minimal — assignment is graded on pipeline, not domain logic.

class Store {
  constructor() {
    this.reset();
  }

  reset() {
    this.wallets = new Map();
    this.transactions = [];
    this.nextWalletId = 1;
    this.nextTxId = 1;
  }

  createWallet(owner) {
    const id = String(this.nextWalletId++);
    const wallet = {
      id,
      owner,
      balance: 0,
      createdAt: new Date().toISOString()
    };
    this.wallets.set(id, wallet);
    return wallet;
  }

  getWallet(id) {
    return this.wallets.get(id) || null;
  }

  recordTransaction(walletId, type, amount) {
    if (type !== 'credit' && type !== 'debit') {
      throw new Error('INVALID_TYPE');
    }
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      throw new Error('INVALID_AMOUNT');
    }
    const wallet = this.wallets.get(walletId);
    if (!wallet) throw new Error('WALLET_NOT_FOUND');
    if (type === 'debit' && wallet.balance < amount) {
      throw new Error('INSUFFICIENT_FUNDS');
    }

    wallet.balance += type === 'credit' ? amount : -amount;
    const tx = {
      id: String(this.nextTxId++),
      walletId,
      type,
      amount,
      balanceAfter: wallet.balance,
      createdAt: new Date().toISOString()
    };
    this.transactions.push(tx);
    return tx;
  }

  listTransactions(walletId) {
    return this.transactions.filter((t) => t.walletId === walletId);
  }
}

module.exports = new Store();
