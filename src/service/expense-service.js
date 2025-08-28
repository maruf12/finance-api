import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createExpenseValidation, getExpenseValidation } from "../validation/expense-validation.js";
import { getGroupValidation } from "../validation/group-validation.js";


const create = async (user, request) => {
  const expense = validate(createExpenseValidation, request);
  expense.userUsername = user.username;

  // Pastikan groupId valid dan milik user
  const group = await prismaClient.group.findFirst({
    where: {
      id: expense.groupId,
      userUsername: user.username,
    },
    select: { id: true }
  });
  if (!group) {
    throw new ResponseError(400, "Group not found");
  }

  // Jika categoryId ada, pastikan valid dan milik group
  if (expense.categoryId) {
    const category = await prismaClient.category.findFirst({
      where: {
        id: expense.categoryId,
        groupId: expense.groupId,
      },
      select: { id: true }
    });
    if (!category) {
      throw new ResponseError(400, "Category not found in group");
    }
  }

  return prismaClient.expense.create({
    data: expense,
    select: {
      id: true,
      groupId: true,
      categoryId: true,
      tanggal: true,
      title: true,
      amount: true,
      note: true,
      createdAt: true,
      updatedAt: true,
    }
  });
};

const get = async (user, expenseId) => {
  expenseId = validate(getExpenseValidation, expenseId);
  const expense = await prismaClient.expense.findFirst({
    where: {
      id: expenseId,
      userUsername: user.username,
    },
    select: {
      id: true,
      groupId: true,
      categoryId: true,
      tanggal: true,
      title: true,
      amount: true,
      note: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  if (!expense) {
    throw new ResponseError(404, "Expense not found");
  }
  return expense;
};

export default {
  create,
  get
};
