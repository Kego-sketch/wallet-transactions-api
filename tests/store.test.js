const store = require('../src/lib/store');

beforeEach(() => store.reset());

describe('store unit tests', () => {
  test('creates a wallet with zero balance', () => {
    const w = store.createWallet('nathi');
    expect(w.balance).toBe(0);
    expect(w.owner).toBe('nathi');
    expect(w.id).toBeDefined();
  });

  test('credit then debit updates balance correctly', () => {
    const w = store.createWallet('nathi');
    store.recordTransaction(w.id, 'credit', 100);
    store.recordTransaction(w.id, 'debit', 30);
    expect(store.getWallet(w.id).balance).toBe(70);
  });

  test('rejects debit beyond available balance', () => {
    const w = store.createWallet('nathi');
    store.recordTransaction(w.id, 'credit', 50);
    expect(() => store.recordTransaction(w.id, 'debit', 100))
      .toThrow('INSUFFICIENT_FUNDS');
  });

  test('rejects zero or negative amounts', () => {
    const w = store.createWallet('nathi');
    expect(() => store.recordTransaction(w.id, 'credit', 0)).toThrow('INVALID_AMOUNT');
    expect(() => store.recordTransaction(w.id, 'credit', -10)).toThrow('INVALID_AMOUNT');
  });

  test('rejects invalid transaction types', () => {
    const w = store.createWallet('nathi');
    expect(() => store.recordTransaction(w.id, 'transfer', 10)).toThrow('INVALID_TYPE');
  });

  test('rejects transactions on missing wallet', () => {
    expect(() => store.recordTransaction('999', 'credit', 10)).toThrow('WALLET_NOT_FOUND');
  });

  test('listTransactions filters per wallet', () => {
    const a = store.createWallet('a');
    const b = store.createWallet('b');
    store.recordTransaction(a.id, 'credit', 10);
    store.recordTransaction(b.id, 'credit', 20);
    expect(store.listTransactions(a.id)).toHaveLength(1);
    expect(store.listTransactions(b.id)).toHaveLength(1);
  });
});
