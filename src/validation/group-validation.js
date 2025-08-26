import Joi from 'joi';

const createGroupValidation = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(255).optional(),
});

const getGroupValidation = Joi.string().uuid().required();

export {
  createGroupValidation,
  getGroupValidation
}
