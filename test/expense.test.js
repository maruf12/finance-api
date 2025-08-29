import supertest from 'supertest';
import { web } from '../src/application/web.js';
import { createTestUser, removeTestUser, createTestGroup, removeAllTestGroup, getTestGroup, createTestCategory, removeAllTestCategory, getTestCategory } from './test-utils.js';
import { logger } from '../src/application/logging.js';

describe('POST /api/expenses', () => {
  beforeEach(async () => {
    await removeTestUser();
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
    await removeTestUser();
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
    await removeTestUser();
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
    await removeTestUser();
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
    await removeTestUser();
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

  it('should filter expenses by categoryId', async () => {
    // Pastikan semua data test dihapus sebelum membuat user, grup, kategori
    await removeAllTestGroup();
    await removeAllTestCategory();
    await removeTestUser();
    await createTestUser();
    await createTestGroup();
    await createTestCategory();
    const testGroup = await getTestGroup();
    const testCategory = await getTestCategory();
    // Buat expense dengan kategori tersebut
    await supertest(web)
      .post('/api/expenses')
      .set('Authorization', 'test')
      .send({
        groupId: testGroup.id,
        categoryId: testCategory.id,
        tanggal: new Date().toISOString(),
        title: 'Expense Filter Cat',
        amount: 1234,
        note: 'Filter by category'
      });
    const result = await supertest(web)
      .get(`/api/expenses?categoryId=${testCategory.id}`)
      .set('Authorization', 'test');
    expect(result.status).toBe(200);
    expect(Array.isArray(result.body.data)).toBe(true);
    expect(result.body.data.length).toBeGreaterThanOrEqual(1);
    for (const exp of result.body.data) {
      expect(exp.categoryId).toBe(testCategory.id);
    }
  });

  it('should filter expenses by start_date and end_date', async () => {
    await removeAllTestGroup();
    await removeAllTestCategory();
    await removeTestUser();
    await createTestUser();
    await createTestGroup();
    await createTestCategory();
    const testGroup = await getTestGroup();
    const testCategory = await getTestCategory();
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    // Create expense with yesterday's date
    await supertest(web)
      .post('/api/expenses')
      .set('Authorization', 'test')
      .send({
        groupId: testGroup.id,
        categoryId: testCategory.id,
        tanggal: yesterday.toISOString(),
        title: 'Expense Yesterday',
        amount: 3000,
        note: 'Yesterday'
      });
    // Create expense with today
    await supertest(web)
      .post('/api/expenses')
      .set('Authorization', 'test')
      .send({
        groupId: testGroup.id,
        categoryId: testCategory.id,
        tanggal: now.toISOString(),
        title: 'Expense Today',
        amount: 4000,
        note: 'Today'
      });
    // Filter only today and tomorrow
    const result = await supertest(web)
      .get(`/api/expenses?start_date=${now.toISOString()}&end_date=${tomorrow.toISOString()}`)
      .set('Authorization', 'test');
    expect(result.status).toBe(200);
    expect(Array.isArray(result.body.data)).toBe(true);
    // Semua tanggal expense >= now && <= tomorrow
    for (const exp of result.body.data) {
      expect(new Date(exp.tanggal) >= now).toBe(true);
      expect(new Date(exp.tanggal) <= tomorrow).toBe(true);
    }
  });

  it('should paginate expenses (default 10 per page)', async () => {
    await removeAllTestGroup();
    await removeAllTestCategory();
    await removeTestUser();
    await createTestUser();
    await createTestGroup();
    await createTestCategory();
    const testGroup = await getTestGroup();
    const testCategory = await getTestCategory();
    // Buat 15 expense
    for (let i = 1; i <= 15; i++) {
      await supertest(web)
        .post('/api/expenses')
        .set('Authorization', 'test')
        .send({
          groupId: testGroup.id,
          categoryId: testCategory.id,
          tanggal: new Date().toISOString(),
          title: `Expense ${i}`,
          amount: 1000 + i,
          note: `Note ${i}`
        });
    }
    // Test halaman pertama
    const result1 = await supertest(web)
      .get('/api/expenses')
      .set('Authorization', 'test');
    expect(result1.status).toBe(200);
    expect(Array.isArray(result1.body.data)).toBe(true);
    expect(result1.body.data.length).toBe(10);
    expect(result1.body.meta.page).toBe(1);
    expect(result1.body.meta.limit).toBe(10);
    expect(result1.body.meta.total).toBe(15);
    expect(result1.body.meta.totalPages).toBe(2);
    // Test halaman kedua
    const result2 = await supertest(web)
      .get('/api/expenses?page=2')
      .set('Authorization', 'test');
    expect(result2.status).toBe(200);
    expect(Array.isArray(result2.body.data)).toBe(true);
    expect(result2.body.data.length).toBe(5);
    expect(result2.body.meta.page).toBe(2);
    expect(result2.body.meta.limit).toBe(10);
    expect(result2.body.meta.total).toBe(15);
    expect(result2.body.meta.totalPages).toBe(2);
  });
