const request = require('supertest');
const { app, shellEscape } = require('../server');

describe('Health endpoint', () => {
  test('GET /health returns healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('road-deploy');
    expect(res.body.version).toBe('1.0.0');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('Deploy endpoint validation', () => {
  test('POST /api/deploy rejects missing domain', async () => {
    const res = await request(app)
      .post('/api/deploy')
      .send({ repo_url: 'https://github.com/test/repo.git' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/domain.*required/i);
  });

  test('POST /api/deploy rejects missing repo_url', async () => {
    const res = await request(app)
      .post('/api/deploy')
      .send({ domain: 'test.blackroad.io' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/repo_url.*required/i);
  });

  test('POST /api/deploy rejects empty body', async () => {
    const res = await request(app)
      .post('/api/deploy')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('Deployment status endpoint', () => {
  test('GET /api/deploy/:id returns status for unknown id', async () => {
    const res = await request(app).get('/api/deploy/nonexistent-id');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.deployment_id).toBe('nonexistent-id');
    expect(res.body.status).toBe('completed_or_failed');
  });
});

describe('Webhook validation', () => {
  test('POST /api/webhook/github rejects invalid payload', async () => {
    const res = await request(app)
      .post('/api/webhook/github')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('shellEscape', () => {
  test('escapes single quotes', () => {
    expect(shellEscape("it's")).toBe("'it'\\''s'");
  });

  test('wraps normal strings in single quotes', () => {
    expect(shellEscape('hello')).toBe("'hello'");
  });

  test('handles empty string', () => {
    expect(shellEscape('')).toBe("''");
  });

  test('returns empty string for non-string input', () => {
    expect(shellEscape(undefined)).toBe('');
    expect(shellEscape(null)).toBe('');
  });

  test('escapes command injection attempts', () => {
    const malicious = '; rm -rf /';
    const escaped = shellEscape(malicious);
    expect(escaped).toBe("'; rm -rf /'");
  });
});
