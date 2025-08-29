import expenseService from "../service/expense-service.js";

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    const result = await expenseService.create(user, request);
    res.status(200).json({
      data: result
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const user = req.user;
    const expenseId = req.params.expenseId;
    const result = await expenseService.get(user, expenseId);
    res.status(200).json({
      data: result
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const user = req.user;
    const expenseId = req.params.expenseId;
    const request = req.body;
    const result = await expenseService.update(user, expenseId, request);
    res.status(200).json({
      data: result
    });
  } catch (e) {
    next(e);
  }
};

export default {
  create,
  get,
  update
};
