const request = require('supertest');
const app = require('../../src/app');

describe('Unit Tests - API Endpoints', () => {
  
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /generate', () => {
    it('should generate text with valid prompt', async () => {
      const response = await request(app)
        .post('/generate')
        .send({ prompt: 'Test prompt' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('generated');
      expect(response.body).toHaveProperty('prompt', 'Test prompt');
    });

    it('should return 400 without prompt', async () => {
      const response = await request(app)
        .post('/generate')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });
});
