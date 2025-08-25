import { web } from "../src/application/web.js";
import { prismaClient } from "../src/application/database.js";
import supertest from "supertest";
import { logger } from "../src/application/logging.js";

describe("POST /api/users", () => {

  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: {
        username: "testuser",
      },
    })
  });

  it("should register a new user", async () => {
    const result = await supertest(web)
      .post("/api/users")
      .send({
        username: "testuser",
        password: "password123",
        name: "Test User",
        email: "test@gmail.com"
      })

      expect(result.status).toBe(200);
      expect(result.body.data.username).toBe("testuser");
      expect(result.body.data.name).toBe("Test User");
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

      logger.info(result.body);

      expect(result.status).toBe(400);
      expect(result.body.errors).toBeDefined();
  });

  it("should register a new user", async () => {
    let result = await supertest(web)
      .post("/api/users")
      .send({
        username: "testuser",
        password: "password123",
        name: "Test User",
        email: "test@gmail.com"
      })

      expect(result.status).toBe(200);
      expect(result.body.data.username).toBe("testuser");
      expect(result.body.data.name).toBe("Test User");
      expect(result.body.data.email).toBe("test@gmail.com");
      expect(result.body.data.password).toBeUndefined();

      result = await supertest(web)
      .post("/api/users")
      .send({
        username: "testuser",
        password: "password123",
        name: "Test User",
        email: "test@gmail.com"
      })

      logger.info(result.body);

      expect(result.status).toBe(400);
      expect(result.body.errors).toBeDefined();
  });
})
