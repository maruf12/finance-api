import categoryService from "../service/category-service.js";

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const groupId = req.params.groupId;
    const request = req.body;
    const result = await categoryService.create(user, groupId, request);
    res.status(200).json({
      data: result
    });
  } catch (e) {
    next(e);
  }
}

export default {
  create,
}
