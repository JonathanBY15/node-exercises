const request = require('supertest'); // Only for simulation of requests
const app = require('../app'); // Import your Express app

describe('Invoices API', () => {
  test('GET /invoices should return a list of invoices', async () => {
    const response = await request(app).get('/invoices');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('invoices');
    expect(Array.isArray(response.body.invoices)).toBe(true);
  });

  test('GET /invoices/:id should return a specific invoice', async () => {
    const response = await request(app).get('/invoices/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('invoice');
    expect(typeof response.body.invoice).toBe('object');
  });

  test('PUT /invoices/:id should update an existing invoice', async () => {
    const response = await request(app)
      .put('/invoices/1')
      .send({ amt: 150 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('invoice');
    expect(typeof response.body.invoice).toBe('object');
  });

  test('DELETE /invoices/:id should delete an invoice', async () => {
    const response = await request(app).delete('/invoices/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'deleted');
  });
});
