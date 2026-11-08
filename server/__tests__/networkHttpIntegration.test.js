const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/server');
const { createTestClient } = require('./helpers/expressTestClient');

describe('Vynora Connect — Network Module Express Route & Middleware Integration Tests', () => {
  const client = createTestClient(app);

  it('GET /api/health returns HTTP 200 with module status', async () => {
    const res = await client.request({ method: 'GET', url: '/api/health' });
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.match(res.body.module, /Module 2/);
  });

  it('GET /api/v1/network/me/profile without authentication rejects with HTTP 401', async () => {
    const res = await client.request({
      method: 'GET',
      url: '/api/v1/network/me/profile',
      user: null,
    });
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'UNAUTHENTICATED');
  });

  it('PUT /api/v1/network/me/profile without authentication rejects with HTTP 401', async () => {
    const res = await client.request({
      method: 'PUT',
      url: '/api/v1/network/me/profile',
      user: null,
      body: { bio: 'Hacker' },
    });
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'UNAUTHENTICATED');
  });

  it('GET /api/v1/network/connections without authentication rejects with HTTP 401', async () => {
    const res = await client.request({
      method: 'GET',
      url: '/api/v1/network/connections',
      user: null,
    });
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'UNAUTHENTICATED');
  });

  it('POST /api/v1/network/requests without authentication rejects with HTTP 401', async () => {
    const res = await client.request({
      method: 'POST',
      url: '/api/v1/network/requests',
      user: null,
      body: { recipientId: '507f1f77bcf86cd799439011' },
    });
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'UNAUTHENTICATED');
  });

  it('GET /api/v1/network/students/:userId with malformed ObjectId returns HTTP 400', async () => {
    const res = await client.request({
      method: 'GET',
      url: '/api/v1/network/students/malformed-id-123',
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'INVALID_USER_ID');
  });

  it('POST /api/v1/network/requests with authenticated user but malformed recipientId returns HTTP 400', async () => {
    const res = await client.request({
      method: 'POST',
      url: '/api/v1/network/requests',
      user: { _id: '507f1f77bcf86cd799439011' },
      body: { recipientId: 'not-an-objectid' },
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'INVALID_RECIPIENT_ID');
  });

  it('PATCH /api/v1/network/requests/:id/accept with malformed ID returns HTTP 400', async () => {
    const res = await client.request({
      method: 'PATCH',
      url: '/api/v1/network/requests/bad-id/accept',
      user: { _id: '507f1f77bcf86cd799439011' },
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'INVALID_REQUEST_ID');
  });

  it('DELETE /api/v1/network/connections/:id without auth rejects with HTTP 401', async () => {
    const res = await client.request({
      method: 'DELETE',
      url: '/api/v1/network/connections/507f1f77bcf86cd799439011',
      user: null,
    });
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'UNAUTHENTICATED');
  });

  it('GET /api/unknown_route returns HTTP 404 Route Not Found envelope', async () => {
    const res = await client.request({
      method: 'GET',
      url: '/api/non_existent_endpoint',
    });
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'ROUTE_NOT_FOUND');
  });
});
