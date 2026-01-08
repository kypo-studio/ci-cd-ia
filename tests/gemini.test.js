// tests/gemini.test.js
const request = require('supertest');
const app = require('../index');

describe('Gemini API', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /api/gemini/health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/gemini/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('healthy');
    });
  });

  describe('POST /api/gemini/generate', () => {
    it('should return 400 if no prompt provided', async () => {
      const res = await request(app)
        .post('/api/gemini/generate')
        .send({});
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('should generate text from prompt', async () => {
      const res = await request(app)
        .post('/api/gemini/generate')
        .send({ prompt: 'Say hello in French' });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.response).toBeDefined();
    }, 10000); // Timeout 10s car API externe
  });
});
