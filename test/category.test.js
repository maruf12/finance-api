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
      .post(`/api/groups/${testGroup.id}/categories`)
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
      .post(`/api/groups/${testGroup.id}/categories`)
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

describe('PUT /api/groups/:groupId/categories/:categoryId', () => {
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

  it('should update a category', async () => {
    const testGroup = await getTestGroup();
    const testCategory = await getTestCategory();
    const result = await supertest(web)
      .put(`/api/groups/${testGroup.id}/categories/${testCategory.id}`)
      .set('Authorization', `test`)
      .send({
        name: 'Updated Category',
        note: 'Updated note',
      });

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe('Updated Category');
    expect(result.body.data.note).toBe('Updated note');
    expect(result.body.data.id).toBe(testCategory.id);
    expect(result.body.data.updatedAt).toBeDefined();
  });

  it('should reject if category not found', async () => {
    const testGroup = await getTestGroup();
    const result = await supertest(web)
      .put(`/api/groups/${testGroup.id}/categories/invalid-uuid-1234`)
      .set('Authorization', `test`)
      .send({
        name: 'Updated Category',
        note: 'Updated note',
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if request invalid', async () => {
    const testGroup = await getTestGroup();
    const testCategory = await getTestCategory();
    const result = await supertest(web)
      .put(`/api/groups/${testGroup.id}/categories/${testCategory.id}`)
      .set('Authorization', `test`)
      .send({
        name: '',
        note: ''.repeat(300),
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe('DELETE /api/groups/:groupId/categories/:categoryId', () => {
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

  it('should delete a category', async () => {
    const testGroup = await getTestGroup();
    const testCategory = await getTestCategory();
    const result = await supertest(web)
      .delete(`/api/groups/${testGroup.id}/categories/${testCategory.id}`)
      .set('Authorization', `test`);

    expect(result.status).toBe(200);
    expect(result.body.message).toBe('Category deleted');
  });

  it('should reject if category not found', async () => {
    const testGroup = await getTestGroup();
    const result = await supertest(web)
      .delete(`/api/groups/${testGroup.id}/categories/invalid-uuid-1234`)
      .set('Authorization', `test`);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe('GET /api/groups/:groupId/categories', () => {
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

  it('should list all categories in group', async () => {
    const testGroup = await getTestGroup();
    // Buat beberapa kategori
    await createTestCategory(2);
    const result = await supertest(web)
      .get(`/api/groups/${testGroup.id}/categories`)
      .set('Authorization', `test`);

    expect(result.status).toBe(200);
    expect(Array.isArray(result.body.data)).toBe(true);
    expect(result.body.data.length).toBeGreaterThanOrEqual(1);
    expect(result.body.data[0].id).toBeDefined();
    expect(result.body.data[0].name).toBeDefined();
    expect(result.body.data[0].createdAt).toBeDefined();
    expect(result.body.data[0].updatedAt).toBeDefined();
  });
});
