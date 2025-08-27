import supertest from 'supertest';
import { web } from '../src/application/web.js';
import { createTestUser, removeTestUser, removeAllTestGroup, createTestGroup, getTestGroup, removeAllTestCategory } from './test-utils.js';
import { logger } from '../src/application/logging.js';

describe('POST /api/categoris', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestGroup();
  });

  afterEach(async () => {
    await removeAllTestCategory();
    await removeAllTestGroup();
    await removeTestUser();
  });

  it('should create a new category', async () => {
    const testGroup = await getTestGroup();
    const result = await supertest(web)
      .post(`/api/${testGroup.id}/categories`)
      .set('Authorization', `test`)
      .send({
        name: 'Test Category',
        note: 'This is a test category',
      });

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe('Test Category');
    expect(result.body.data.note).toBe('This is a test category');
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.createdAt).toBeDefined();
    expect(result.body.data.updatedAt).toBeDefined();
  });

  it('should reject if request invalid', async () => {
    const testGroup = await getTestGroup();
    const result = await supertest(web)
      .post(`/api/${testGroup.id}/categories`)
      .set('Authorization', `test`)
      .send({
        name: '',
        description: '',
      });
      
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
