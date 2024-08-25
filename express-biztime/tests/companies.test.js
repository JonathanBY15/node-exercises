const request = require('supertest'); // Only for simulation of requests
const app = require('../app'); // Import your Express app

describe('Companies API', () => {
  test('GET /companies should return a list of companies', async () => {
    const response = await request(app).get('/companies');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('companies');
    expect(Array.isArray(response.body.companies)).toBe(true);
  });

  test('POST /companies should create a new company', async () => {
    const response = await request(app)
      .post('/companies')
      .send({ code: 'newcode', name: 'New Company', description: 'A new company' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('company');
    expect(typeof response.body.company).toBe('object');
  });
});
