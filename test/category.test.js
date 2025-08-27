import supertest from 'supertest';
import { web } from '../src/application/web.js';
import { createTestUser, removeTestUser, removeAllTestGroup, createTestGroup, getTestGroup, removeAllTestCategory, createTestCategory, getTestCategory } from './test-utils.js';
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

describe('GET /api/groups/:groupId/categories/:categoryId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestGroup();
    await createTestCategory();
  });

  afterEach(async () => {
    await removeAllTestCategory();
    await removeAllTestGroup();
    await removeTestUser();
  });

  it('should get a category by id', async () => {
    const testGroup = await getTestGroup();
    const testCategory = await getTestCategory();

    const getResult = await supertest(web)
      .get(`/api/groups/${testGroup.id}/categories/${testCategory.id}`)
      .set('Authorization', `test`);

    expect(getResult.status).toBe(200);
    expect(getResult.body.data.name).toBe('Test Category');
    expect(getResult.body.data.note).toBe('This is a test category');
    expect(getResult.body.data.id).toBeDefined();
    expect(getResult.body.data.createdAt).toBeDefined();
    expect(getResult.body.data.updatedAt).toBeDefined();
  });

  it('should reject if category not found', async () => {
    const testGroup = await getTestGroup();
    const result = await supertest(web)
      .get(`/api/groups/${testGroup.id}/categories/${9999}`)
      .set('Authorization', `test`);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if request invalid', async () => {
    const testGroup = await getTestGroup();
    const testCategory = await getTestCategory();
    const result = await supertest(web)
      .get(`/api/groups/${testGroup.id}i/categories/${testCategory.id}`)
      .set('Authorization', `test`);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
