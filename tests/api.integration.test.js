const request = require('supertest');
const app = require('../src/app');
const store = require('../src/lib/store');

beforeEach(() => store.reset());

describe('API integration', () => {
  test('full wallet lifecycle works end-to-end', async () => {
    const create = await request(app).post('/wallets').send({ owner: 'nathi' });
    expect(create.status).toBe(201);
    const id = create.body.id;

    const credit = await request(app)
      .post('/transactions')
      .send({ walletId: id, type: 'credit', amount: 500 });
    expect(credit.status).toBe(201);
    expect(credit.body.balanceAfter).toBe(500);

    const debit = await request(app)
      .post('/transactions')
      .send({ walletId: id, type: 'debit', amount: 200 });
    expect(debit.status).toBe(201);
    expect(debit.body.balanceAfter).toBe(300);

    const list = await request(app).get(`/transactions/${id}`);
    expect(list.body).toHaveLength(2);

    const wallet = await request(app).get(`/wallets/${id}`);
    expect(wallet.body.balance).toBe(300);
  });

  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('rejects malformed wallet creation', async () => {
    const res = await request(app).post('/wallets').send({});
    expect(res.status).toBe(400);
  });

  test('rejects overdraft with 422', async () => {
    const w = await request(app).post('/wallets').send({ owner: 'x' });
    const res = await request(app)
      .post('/transactions')
      .send({ walletId: w.body.id, type: 'debit', amount: 1 });
    expect(res.status).toBe(422);
    expect(res.body.error).toBe('INSUFFICIENT_FUNDS');
  });

  test('returns 404 for missing wallet', async () => {
    const res = await request(app).get('/wallets/does-not-exist');
    expect(res.status).toBe(404);
  });
});
