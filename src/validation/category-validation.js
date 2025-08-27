import Joi from "joi";

const createCategoryValidation = Joi.object({
  name: Joi.string().max(100).required(),
  note: Joi.string().max(255).optional()
});

const getCategoryValidation = Joi.string().uuid().required();

const updateCategoryValidation = Joi.object({
  name: Joi.string().max(100).optional(),
  note: Joi.string().max(255).optional()
});

export {
  createCategoryValidation,
  getCategoryValidation,
  updateCategoryValidation
}
