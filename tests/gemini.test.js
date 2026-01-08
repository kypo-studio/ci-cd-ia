// tests/gemini.test.js
const request = require('supertest');
const app = require('../index');

describe('Gemini API', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'OK');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
    });
  });

  describe('GET /', () => {
    it('should serve the home page', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toMatch(/html/);
    });
  });

  describe('GET /api/gemini/health', () => {
    it('should return Gemini service health', async () => {
      const res = await request(app).get('/api/gemini/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('service');
      expect(res.body).toHaveProperty('status');
    });
  });

  describe('POST /api/gemini/generate', () => {
    it('should return 400 if no prompt provided', async () => {
      const res = await request(app).post('/api/gemini/generate').send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should generate text from prompt', async () => {
      const res = await request(app)
        .post('/api/gemini/generate')
        .send({ prompt: 'Say hello' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('response');
      expect(typeof res.body.data.response).toBe('string');
      expect(res.body.data.response.length).toBeGreaterThan(0);
    }, 10000); // Timeout 10s car API externe
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/unknown');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
