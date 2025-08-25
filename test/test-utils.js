import { prismaClient } from "../src/application/database.js"
import bcrypt from "bcrypt"

export const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: "test",
    },
  })
}

export const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      username: "test",
      password: await bcrypt.hash("password123", 10),
      name: "test",
      email: "test@gmail.com",
      token: "test"
    }
  })
}

export const getTestUser = async () => {
  return prismaClient.user.findUnique({
    where: {
      username: "test",
    },
  })
}
