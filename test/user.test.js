import { web } from "../src/application/web.js";
import supertest from "supertest";
import { logger } from "../src/application/logging.js";
import { removeTestUser, createTestUser } from "./test-utils.js";

describe("POST /api/users", () => {

  afterEach(async () => {
    await removeTestUser();
  });

  it("should register a new user", async () => {
    const result = await supertest(web)
      .post("/api/users")
      .send({
        username: "test",
        password: "password123",
        name: "test",
        email: "test@gmail.com"
      })

      expect(result.status).toBe(200);
      expect(result.body.data.username).toBe("test");
      expect(result.body.data.name).toBe("test");
      expect(result.body.data.email).toBe("test@gmail.com");
      expect(result.body.data.password).toBeUndefined();
  });

  it("should reject if request invalid", async () => {
    const result = await supertest(web)
      .post("/api/users")
      .send({
        username: "",
        password: "",
        name: "",
        email: ""
      })

      // logger.info(result.body);

      expect(result.status).toBe(400);
      expect(result.body.errors).toBeDefined();
  });

  it("should register a new user", async () => {
    let result = await supertest(web)
      .post("/api/users")
      .send({
        username: "test",
        password: "password123",
        name: "test",
        email: "test@gmail.com"
      })

      expect(result.status).toBe(200);
      expect(result.body.data.username).toBe("test");
      expect(result.body.data.name).toBe("test");
      expect(result.body.data.email).toBe("test@gmail.com");
      expect(result.body.data.password).toBeUndefined();

      result = await supertest(web)
      .post("/api/users")
      .send({
        username: "test",
        password: "password123",
        name: "test",
        email: "test@gmail.com"
      })

      // logger.info(result.body);

      expect(result.status).toBe(400);
      expect(result.body.errors).toBeDefined();
  });
})

describe("POST /api/users/login", () => {

  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should login and return token", async () => {
    const result = await supertest(web)
      .post("/api/users/login")
      .send({
        username: "test",
        password: "password123",
      })

      logger.info(result);

      expect(result.status).toBe(200);
      expect(result.body.data.token).toBeDefined();
      expect(result.body.data.token).not.toBe("test");
  });

  it("should reject if request invalid", async () => {
    const result = await supertest(web)
      .post("/api/users/login")
      .send({
        username: "",
        password: "",
      })

      // logger.info(result.body);

      expect(result.status).toBe(400);
      expect(result.body.errors).toBeDefined();
  });

  it("should reject if username not found", async () => {
    const result = await supertest(web)
      .post("/api/users/login")
      .send({
        username: "notfound",
        password: "password123",
      })

      // logger.info(result.body);

      expect(result.status).toBe(401);
      expect(result.body.errors).toBeDefined();
  });

  it("should reject if password is invalid", async () => {
    const result = await supertest(web)
      .post("/api/users/login")
      .send({
        username: "test",
        password: "invalid",
      })

      // logger.info(result.body);

      expect(result.status).toBe(401);
      expect(result.body.errors).toBeDefined();
  });
})
