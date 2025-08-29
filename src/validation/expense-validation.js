import Joi from "joi";

const createExpenseValidation = Joi.object({
  groupId: Joi.string().uuid().required(),
  categoryId: Joi.string().uuid().optional().allow(null),
  tanggal: Joi.date().required(),
  title: Joi.string().max(255).required(),
  amount: Joi.number().required(),
  note: Joi.string().max(255).optional().allow(null)
});

const getExpenseValidation = Joi.string().uuid().required();

const updateExpenseValidation = Joi.object({
  groupId: Joi.string().uuid().optional(),
  categoryId: Joi.string().uuid().optional().allow(null),
  tanggal: Joi.date().optional(),
  title: Joi.string().max(255).optional(),
  amount: Joi.number().optional(),
  note: Joi.string().max(255).optional().allow(null)
});

export {
  createExpenseValidation,
  getExpenseValidation,
  updateExpenseValidation
}
