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

export default {
  create,
  get
}
