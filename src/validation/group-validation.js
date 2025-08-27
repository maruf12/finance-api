import Joi from 'joi';

const createGroupValidation = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(255).optional(),
});

const getGroupValidation = Joi.string().uuid().required();

const updateGroupValidation = Joi.object({
  id: Joi.string().uuid().required(),
  name: Joi.string().max(100).optional(),
  description: Joi.string().max(255).optional(),
});

export {
  createGroupValidation,
  getGroupValidation,
  updateGroupValidation
}
