import { ResponseError } from "../error/response-error.js";

const validate = (schema, request) => {
  const { error, value } = schema.validate(request, {
    abortEarly: false,
  });
  if (error) {
    throw new ResponseError(400, error.message);
  } else {
    return value;
  }
}

export {
  validate
}
