const request = require('supertest');
const app = require('../../src/app');

describe('E2E Tests - Complete API Flow', () => {
  
  it('should complete full API workflow', async () => {
    // 1. Check health
    const healthResponse = await request(app).get('/health');
    expect(healthResponse.status).toBe(200);

    // 2. Generate text
    const generateResponse = await request(app)
      .post('/generate')
      .send({ prompt: 'E2E test prompt' });
    
    expect(generateResponse.status).toBe(200);
    expect(generateResponse.body.generated).toContain('E2E test prompt');
  });

  it('should handle errors gracefully', async () => {
    const response = await request(app)
      .post('/generate')
      .send({ invalid: 'data' });
    
    expect(response.status).toBe(400);
  });
});
