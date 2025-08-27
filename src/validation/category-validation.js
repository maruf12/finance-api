import Joi from "joi";

const createCategoryValidation = Joi.object({
  name: Joi.string().max(100).required(),
  note: Joi.string().max(255).optional()
});

export {
  createCategoryValidation,
}
