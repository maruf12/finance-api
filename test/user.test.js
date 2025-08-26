import { web } from "../src/application/web.js";
import supertest from "supertest";
import { logger } from "../src/application/logging.js";
import { removeTestUser, createTestUser, getTestUser } from "./test-utils.js";
import bcrypt from "bcrypt";

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

      // logger.info(result);

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

describe("GET /api/users/current", () => {

  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should return current user", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "test")

      logger.info(result.body);

      expect(result.status).toBe(200);
      expect(result.body.data.username).toBe("test");
      expect(result.body.data.name).toBe("test");
      expect(result.body.data.email).toBe("test@gmail.com");
  });
  it("should reject if token not provided", async () => {
    const result = await supertest(web)
      .get("/api/users/current")

      // logger.info(result.body);

      expect(result.status).toBe(401);
      expect(result.body.errors).toBeDefined();
  });
  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "invalid")
      // logger.info(result.body);
      expect(result.status).toBe(401);
      expect(result.body.errors).toBeDefined();
  });
})

describe("PATCH /api/users/current", () => {

  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should update current user", async () => {
    let result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        name: "newname",
        email: "newemail@gmail.com",
        password: "rahasialagi"
      })

      logger.info(result.body);
      expect(result.status).toBe(200);
      expect(result.body.data.username).toBe("test");
      expect(result.body.data.name).toBe("newname");
      expect(result.body.data.email).toBe("newemail@gmail.com");

      const user = await getTestUser();
      expect(await bcrypt.compare("rahasialagi", user.password)).toBe(true);
  });

  it("should update password current user", async () => {
    let result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        password: "rahasialagi"
      })

      logger.info(result.body);
      expect(result.status).toBe(200);
      expect(result.body.data.username).toBe("test");
      expect(result.body.data.name).toBe("test");
      expect(result.body.data.email).toBe("test@gmail.com");

      const user = await getTestUser();
      expect(await bcrypt.compare("rahasialagi", user.password)).toBe(true);
  });

  it("should update name current user", async () => {
    let result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        name: "newname",
      })

      logger.info(result.body);
      expect(result.status).toBe(200);
      expect(result.body.data.username).toBe("test");
      expect(result.body.data.name).toBe("newname");
      expect(result.body.data.email).toBe("test@gmail.com");
  });

  it("should update email current user", async () => {
    let result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        email: "newemail@gmail.com",
      })

      logger.info(result.body);
      expect(result.status).toBe(200);
      expect(result.body.data.username).toBe("test");
      expect(result.body.data.name).toBe("test");
      expect(result.body.data.email).toBe("newemail@gmail.com");
  });

  it("should reject if token not provided", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .send({
        name: "newname",
        email: "newemail",
      })

      // logger.info(result.body);

      expect(result.status).toBe(401);
      expect(result.body.errors).toBeDefined();
  });
  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "invalid")
      .send({
        name: "newname",
        email: "newemail",
      })

      // logger.info(result.body);
      expect(result.status).toBe(401);
      expect(result.body.errors).toBeDefined();
  });
  it("should reject if request invalid", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        name: "",
        email: "",
      })

      // logger.info(result.body);

      expect(result.status).toBe(400);
      expect(result.body.errors).toBeDefined();
  });
})

describe("DELETE /api/users/logout", () => {

  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should logout current user", async () => {
    let result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "test")

      logger.info(result.body);
      expect(result.status).toBe(200);
      expect(result.body.data).toBe("OK");

      const user = await getTestUser();
      expect(user.token).toBeNull();
  });

  it("should reject if token not provided", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")

      // logger.info(result.body);

      expect(result.status).toBe(401);
      expect(result.body.errors).toBeDefined();
  });
  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "invalid")
      // logger.info(result.body);
      expect(result.status).toBe(401);
      expect(result.body.errors).toBeDefined();
  });
})