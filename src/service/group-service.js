import { validate } from "../validation/validation.js"
import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"
import { createGroupValidation, getGroupValidation } from "../validation/group-validation.js"
import { logger } from "../application/logging.js"

const create = async (user, request) => {
  const group = validate(createGroupValidation, request);

  group.userUsername = user.username;

  return prismaClient.group.create({
    data: group,
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    }
  });
}

const get = async (user, groupId) => {
  groupId = validate(getGroupValidation, groupId);
  const group = await prismaClient.group.findFirst({
    where: {
      id: groupId,
      userUsername: user.username,
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    }
  })
  
  if (!group) {
    // why this code doesnt execute when group not found?
    throw new ResponseError(404, "Group not found");
  }
  
  return group;
}

// const get = async (user) => {
//   return prismaClient.group.findMany({
//     where: {
//       userUsername: user.username,
//     },
//     select: {
//       id: true,
//       name: true,
//       description: true,
//       createdAt: true,
//       updatedAt: true,
//     }
//   });
// }

export default {
  create,
  get
}
