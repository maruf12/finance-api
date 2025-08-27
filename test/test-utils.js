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

export const removeAllTestGroup = async () => {
  await prismaClient.group.deleteMany({
    where: {
      userUsername: "test"
    }
  })
}

export const createTestGroup = async () => {
  return prismaClient.group.create({
    data: {
      name: "Test Group",
      description: "This is a test group",
      userUsername: "test"
    }
  })
}

export const getTestGroup = async () => {
  return prismaClient.group.findFirst({
    where: {
      userUsername: "test"
    }
  })
}

export const removeAllTestCategory = async () => {
  await prismaClient.category.deleteMany({
    where: {
      group: {
        userUsername: "test"
      }
    }
  })
}

export const createTestCategory = async (n) => {
  const group = await getTestGroup();
  if (!n || typeof n !== 'number' || n < 2) {
    // Default: satu category, nama tetap seperti sebelumnya
    await prismaClient.category.create({
      data: {
        name: `Test Category`,
        note: "This is a test category",
        groupId: group.id
      }
    });
  } else {
    // Jika n > 1, buat sebanyak n category dengan nama unik
    for (let i = 1; i <= n; i++) {
      await prismaClient.category.create({
        data: {
          name: `Test Category ${i}`,
          note: `This is test category ${i}`,
          groupId: group.id
        }
      });
    }
  }
}

export const getTestCategory = async () => {
  return prismaClient.category.findFirst({
    where: {
      group: {
        userUsername: "test"
      }
    }
  })
}
