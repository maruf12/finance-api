import groupService from "../service/group-service.js";

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await groupService.create(user, req.body);
    res.status(200).json({
      data: result
    });
  } catch (e) {
    next(e);
  }
}


const get = async (req, res, next) => {
  try {
    const user = req.user;
    const groupId = req.params.groupId;
    const result = await groupService.get(user, groupId);
    res.status(200).json({
      data: result
    });
  } catch (e) {
    next(e);
  }
}

const update = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    const groupId = req.params.groupId;
    request.id = groupId;

    const result = await groupService.update(user, request);
    res.status(200).json({
      data: result
    });
  } catch (e) {
    next(e);
  }
}

const remove = async (req, res, next) => {
  try {
    const user = req.user;
    const groupId = req.params.groupId;
    await groupService.remove(user, groupId);
    res.status(200).json({
      data: "OK"
    });
  } catch (e) {
    next(e);
  }
}

const list = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await groupService.list(user);
    res.status(200).json({
      data: result
    });
  } catch (e) {
    next(e);
  }
}

export default {
  create,
  get,
  update,
  remove,
  list
}
