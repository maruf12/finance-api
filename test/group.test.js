import supertest from 'supertest';
import { web } from '../src/application/web.js';
import { createTestUser, removeTestUser, removeAllTestGroup, createTestGroup, getTestGroup } from './test-utils.js';
import { logger } from '../src/application/logging.js';

describe('POST /api/groups', () => {

  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestGroup();
    await removeTestUser();
  });

  it('should create a new group', async () => {
    const result = await supertest(web)
      .post('/api/groups')
      .set('Authorization', `test`)
      .send({
        name: 'Test Group',
        description: 'This is a test group',
      });

      // logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe('Test Group');
    expect(result.body.data.description).toBe('This is a test group');
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.createdAt).toBeDefined();
    expect(result.body.data.updatedAt).toBeDefined();
  });

  it('should reject if request invalid', async () => {
    const result = await supertest(web)
      .post('/api/groups')
      .set('Authorization', `test`)
      .send({
        name: '',
        description: '',
      });
      // logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe('GET /api/groups/:groupId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestGroup();
  });

  afterEach(async () => {
    await removeAllTestGroup();
    await removeTestUser();
  });

  it('should get a group by id', async () => {
    const testGroup = await getTestGroup();
    // const groupId = result.body.data.id;
    const result = await supertest(web)
      .get(`/api/groups/${testGroup.id}`)
      .set('Authorization', `test`);

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe('Test Group');
    expect(result.body.data.description).toBe('This is a test group');
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.createdAt).toBeDefined();
    expect(result.body.data.updatedAt).toBeDefined();
  });

  it('should reject if group not found', async () => {
    const testGroup = await getTestGroup();
    const result = await supertest(web)
      .get(`/api/groups/${testGroup.id}i`)
      .set('Authorization', `test`);
    
      logger.info(result);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
})
