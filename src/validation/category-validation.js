import Joi from "joi";

const createCategoryValidation = Joi.object({
  name: Joi.string().max(100).required(),
  note: Joi.string().max(255).optional()
});

const getCategoryValidation = Joi.string().uuid().required();

export {
  createCategoryValidation,
  getCategoryValidation
}
