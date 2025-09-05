const request = require('supertest');
const app = require('../backend/server');

describe('Authentication Endpoints', () => {
  // Test Case 1: Successful Login
  test('POST /api/auth/login - successful login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.message).toBe('Login successful');
    expect(response.body.user.username).toBe('admin');
  });

  // Test Case 2: Invalid Credentials
  test('POST /api/auth/login - authentication failure with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid credentials');
  });

  test('POST /api/auth/login - missing credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username and password required');
  });
});
