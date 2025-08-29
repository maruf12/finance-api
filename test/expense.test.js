import supertest from 'supertest';
import { web } from '../src/application/web.js';
import { createTestUser, removeTestUser, createTestGroup, removeAllTestGroup, getTestGroup, createTestCategory, removeAllTestCategory, getTestCategory } from './test-utils.js';

describe('POST /api/expenses', () => {
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

  it('should create a new expense with category', async () => {
    const testGroup = await getTestGroup();
    const testCategory = await getTestCategory();
    const result = await supertest(web)
      .post('/api/expenses')
      .set('Authorization', 'test')
      .send({
        groupId: testGroup.id,
        categoryId: testCategory.id,
        tanggal: new Date().toISOString(),
        title: 'Test Expense',
        amount: 10000,
        note: 'Test expense note'
      });
    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe('Test Expense');
    expect(result.body.data.amount).toBe("10000");
    expect(result.body.data.groupId).toBe(testGroup.id);
    expect(result.body.data.categoryId).toBe(testCategory.id);
    expect(result.body.data.createdAt).toBeDefined();
    expect(result.body.data.updatedAt).toBeDefined();
  });

  it('should create a new expense without category', async () => {
    const testGroup = await getTestGroup();
    const result = await supertest(web)
      .post('/api/expenses')
      .set('Authorization', 'test')
      .send({
        groupId: testGroup.id,
        tanggal: new Date().toISOString(),
        title: 'Expense No Category',
        amount: 5000,
        note: 'No category'
      });
    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe('Expense No Category');
    expect(result.body.data.amount).toBe("5000");
    expect(result.body.data.groupId).toBe(testGroup.id);
    expect(result.body.data.categoryId).toBeNull();
    expect(result.body.data.createdAt).toBeDefined();
    expect(result.body.data.updatedAt).toBeDefined();
  });

  it('should reject if group not found', async () => {
    const result = await supertest(web)
      .post('/api/expenses')
      .set('Authorization', 'test')
      .send({
        groupId: 'invalid-uuid',
        tanggal: new Date().toISOString(),
        title: 'Invalid Group',
        amount: 1000
      });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if category not found in group', async () => {
    const testGroup = await getTestGroup();
    const result = await supertest(web)
      .post('/api/expenses')
      .set('Authorization', 'test')
      .send({
        groupId: testGroup.id,
        categoryId: 'invalid-uuid',
        tanggal: new Date().toISOString(),
        title: 'Invalid Category',
        amount: 1000
      });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if request invalid', async () => {
    const testGroup = await getTestGroup();
    const result = await supertest(web)
      .post('/api/expenses')
      .set('Authorization', 'test')
      .send({
        groupId: testGroup.id,
        tanggal: '',
        title: '',
        amount: null
      });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe('GET /api/expenses/:expenseId', () => {
  let expenseId;
  beforeEach(async () => {
    await createTestUser();
    await createTestGroup();
    await createTestCategory();
    const testGroup = await getTestGroup();
    const testCategory = await getTestCategory();
    // Create expense
    const result = await supertest(web)
      .post('/api/expenses')
      .set('Authorization', 'test')
      .send({
        groupId: testGroup.id,
        categoryId: testCategory.id,
        tanggal: new Date().toISOString(),
        title: 'Test Expense',
        amount: 10000,
        note: 'Test expense note'
      });
    expenseId = result.body.data.id;
  });

  afterEach(async () => {
    await removeAllTestCategory();
    await removeAllTestGroup();
    await removeTestUser();
  });

  it('should get expense detail by id', async () => {
    const result = await supertest(web)
      .get(`/api/expenses/${expenseId}`)
      .set('Authorization', 'test');
    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(expenseId);
    expect(result.body.data.title).toBe('Test Expense');
    expect(result.body.data.amount).toBe("10000");
    expect(result.body.data.groupId).toBeDefined();
    expect(result.body.data.categoryId).toBeDefined();
    expect(result.body.data.createdAt).toBeDefined();
    expect(result.body.data.updatedAt).toBeDefined();
  });

  it('should reject if expense not found', async () => {
    const result = await supertest(web)
      .get('/api/expenses/invalid-uuid')
      .set('Authorization', 'test');
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe('PUT /api/expenses/:expenseId', () => {
  let expenseId;
  beforeEach(async () => {
    await createTestUser();
    await createTestGroup();
    await createTestCategory();
    const testGroup = await getTestGroup();
    const testCategory = await getTestCategory();
    // Create expense
    const result = await supertest(web)
      .post('/api/expenses')
      .set('Authorization', 'test')
      .send({
        groupId: testGroup.id,
        categoryId: testCategory.id,
        tanggal: new Date().toISOString(),
        title: 'Test Expense',
        amount: 10000,
        note: 'Test expense note'
      });
    expenseId = result.body.data.id;
  });

  afterEach(async () => {
    await removeAllTestCategory();
    await removeAllTestGroup();
    await removeTestUser();
  });

  it('should update expense detail', async () => {
    const testGroup = await getTestGroup();
    const testCategory = await getTestCategory();
    const result = await supertest(web)
      .put(`/api/expenses/${expenseId}`)
      .set('Authorization', 'test')
      .send({
        title: 'Updated Expense',
        amount: 20000,
        note: 'Updated note',
        groupId: testGroup.id,
        categoryId: testCategory.id
      });
    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe('Updated Expense');
    expect(result.body.data.amount).toBe("20000");
    expect(result.body.data.note).toBe('Updated note');
    expect(result.body.data.groupId).toBe(testGroup.id);
    expect(result.body.data.categoryId).toBe(testCategory.id);
    expect(result.body.data.updatedAt).toBeDefined();
  });

  it('should reject if expense not found', async () => {
    const result = await supertest(web)
      .put('/api/expenses/invalid-uuid')
      .set('Authorization', 'test')
      .send({
        title: 'Updated Expense',
        amount: 20000
      });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if group not found', async () => {
    const result = await supertest(web)
      .put(`/api/expenses/${expenseId}`)
      .set('Authorization', 'test')
      .send({
        groupId: 'invalid-uuid',
        title: 'Updated Expense',
        amount: 20000
      });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if category not found in group', async () => {
    const testGroup = await getTestGroup();
    const result = await supertest(web)
      .put(`/api/expenses/${expenseId}`)
      .set('Authorization', 'test')
      .send({
        groupId: testGroup.id,
        categoryId: 'invalid-uuid',
        title: 'Updated Expense',
        amount: 20000
      });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if request invalid', async () => {
    const result = await supertest(web)
      .put(`/api/expenses/${expenseId}`)
      .set('Authorization', 'test')
      .send({
        title: '',
        amount: null
      });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe('DELETE /api/expenses/:expenseId', () => {
  let expenseId;
  beforeEach(async () => {
    await createTestUser();
    await createTestGroup();
    await createTestCategory();
    const testGroup = await getTestGroup();
    const testCategory = await getTestCategory();
    // Create expense
    const result = await supertest(web)
      .post('/api/expenses')
      .set('Authorization', 'test')
      .send({
        groupId: testGroup.id,
        categoryId: testCategory.id,
        tanggal: new Date().toISOString(),
        title: 'Test Expense',
        amount: 10000,
        note: 'Test expense note'
      });
    expenseId = result.body.data.id;
  });

  afterEach(async () => {
    await removeAllTestCategory();
    await removeAllTestGroup();
    await removeTestUser();
  });

  it('should delete expense by id', async () => {
    const result = await supertest(web)
      .delete(`/api/expenses/${expenseId}`)
      .set('Authorization', 'test');
    expect(result.status).toBe(200);
    expect(result.body.message).toBe('Expense deleted');
  });

  it('should reject if expense not found', async () => {
    const result = await supertest(web)
      .delete('/api/expenses/invalid-uuid')
      .set('Authorization', 'test');
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe('GET /api/expenses', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestGroup();
    await createTestCategory();
    const testGroup = await getTestGroup();
    const testCategory = await getTestCategory();
    // Create beberapa expense
    await supertest(web)
      .post('/api/expenses')
      .set('Authorization', 'test')
      .send({
        groupId: testGroup.id,
        categoryId: testCategory.id,
        tanggal: new Date().toISOString(),
        title: 'Expense 1',
        amount: 1000,
        note: 'Note 1'
      });
    await supertest(web)
      .post('/api/expenses')
      .set('Authorization', 'test')
      .send({
        groupId: testGroup.id,
        categoryId: testCategory.id,
        tanggal: new Date().toISOString(),
        title: 'Expense 2',
        amount: 2000,
        note: 'Note 2'
      });
  });

  afterEach(async () => {
    await removeAllTestCategory();
    await removeAllTestGroup();
    await removeTestUser();
  });

  it('should list all expenses for user', async () => {
    const result = await supertest(web)
      .get('/api/expenses')
      .set('Authorization', 'test');
    expect(result.status).toBe(200);
    expect(Array.isArray(result.body.data)).toBe(true);
    expect(result.body.data.length).toBeGreaterThanOrEqual(2);
    expect(result.body.data[0].id).toBeDefined();
    expect(result.body.data[0].title).toBeDefined();
    expect(result.body.data[0].amount).toBeDefined();
    expect(result.body.data[0].createdAt).toBeDefined();
    expect(result.body.data[0].updatedAt).toBeDefined();
  });

  it('should list expenses by groupId', async () => {
    const testGroup = await getTestGroup();
    const result = await supertest(web)
      .get(`/api/expenses?groupId=${testGroup.id}`)
      .set('Authorization', 'test');
    expect(result.status).toBe(200);
    expect(Array.isArray(result.body.data)).toBe(true);
    expect(result.body.data.length).toBeGreaterThanOrEqual(2);
    expect(result.body.data[0].groupId).toBe(testGroup.id);
  });
});
