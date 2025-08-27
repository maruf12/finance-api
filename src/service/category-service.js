import { validate } from "../validation/validation.js"
import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"
import { getGroupValidation } from "../validation/group-validation.js"
import { createCategoryValidation } from "../validation/category-validation.js"

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

export default {
  create,
}
