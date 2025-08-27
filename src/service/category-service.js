import { validate } from "../validation/validation.js"
import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"
import { getGroupValidation } from "../validation/group-validation.js"
import { createCategoryValidation, getCategoryValidation, updateCategoryValidation } from "../validation/category-validation.js"

const update = async (user, groupId, categoryId, request) => {
  groupId = await checkGroupMustExist(user, groupId);
  categoryId = validate(getCategoryValidation, categoryId);
  const data = validate(updateCategoryValidation, request);

  // Pastikan category ada dan milik group yang benar
  const category = await prismaClient.category.findFirst({
    where: {
      id: categoryId,
      groupId: groupId,
    },
    select: {
      id: true
    }
  });
  if (!category) {
    throw new ResponseError(404, "Category not found");
  }

  return prismaClient.category.update({
    where: {
      id: categoryId
    },
    data: {
      ...data,
      updatedAt: new Date()
    },
    select: {
      id: true,
      name: true,
      note: true,
      createdAt: true,
      updatedAt: true,
    }
  });
}

const checkGroupMustExist = async (user, groupId) => {
  groupId = validate(getGroupValidation, groupId);

  const totalGroupInDatabase = await prismaClient.group.count({
    where: {
      id: groupId,
      userUsername: user.username,
    },
  });
  if (totalGroupInDatabase !== 1) {
    throw new ResponseError(400, "Group not found");
  }
  return groupId
}

const create = async (user, groupId, request) => {

  groupId = await checkGroupMustExist(user, groupId);

  const category = validate(createCategoryValidation, request);

  category.groupId = groupId;

  return prismaClient.category.create({
    data: category,
    select: {
      id: true,
      name: true,
      note: true,
      createdAt: true,
      updatedAt: true,
    }
  });
}

const get = async (user, groupId, categoryId) => {
  groupId = await checkGroupMustExist(user, groupId);

  categoryId = validate(getCategoryValidation, categoryId);

  const category = await prismaClient.category.findFirst({
    where: {
      id: categoryId,
      groupId: groupId,
    },
    select: {
      id: true,
      name: true,
      note: true,
      createdAt: true,
      updatedAt: true,
    }
  })

  if (!category) {
    // why this code doesnt execute when category not found?
    throw new ResponseError(404, "Category not found");
  }

  return category;
}

const remove = async (user, groupId, categoryId) => {
  groupId = await checkGroupMustExist(user, groupId);
  categoryId = validate(getCategoryValidation, categoryId);

  // Pastikan category ada dan milik group yang benar
  const category = await prismaClient.category.findFirst({
    where: {
      id: categoryId,
      groupId: groupId,
    },
    select: {
      id: true
    }
  });
  if (!category) {
    throw new ResponseError(404, "Category not found");
  }

  await prismaClient.category.delete({
    where: {
      id: categoryId
    }
  });
  return { message: "Category deleted" };
}

const list = async (user, groupId) => {
  groupId = await checkGroupMustExist(user, groupId);
  return prismaClient.category.findMany({
    where: {
      groupId: groupId,
    },
    select: {
      id: true,
      name: true,
      note: true,
      createdAt: true,
      updatedAt: true,
    }
  });
}

export default {
  create,
  get,
  update,
  remove,
  list
}
