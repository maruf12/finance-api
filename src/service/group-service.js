import { validate } from "../validation/validation.js"
import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"
import { createGroupValidation, getGroupValidation, updateGroupValidation } from "../validation/group-validation.js"

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

const update = async (user, request) => {
  const group = validate(updateGroupValidation, request);

  const totalGroupInDatabase = await prismaClient.group.count({
    where: {
      id: group.id,
      userUsername: user.username,
    },
  });

  if (totalGroupInDatabase !== 1) {
    throw new ResponseError(404, "Group not found");
  }

  return prismaClient.group.update({
    data: {
      name: group.name,
      description: group.description
    },
    where: {
      id: group.id
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    }
  });
}

const remove = async (user, groupId) => {
  groupId = validate(getGroupValidation, groupId);

  const totalGroupInDatabase = await prismaClient.group.count({
    where: {
      id: groupId,
      userUsername: user.username,
    },
  });

  if (totalGroupInDatabase !== 1) {
    throw new ResponseError(404, "Group not found");
  }

  return prismaClient.group.delete({
    where: {
      id: groupId
    }
  });
}

const list = async (user) => {
  return prismaClient.group.findMany({
    where: {
      userUsername: user.username,
    },
    select: {
      id: true,
      name: true,
      description: true,
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
