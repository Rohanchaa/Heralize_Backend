import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  }

  let errors = {};
  err.array().map((err) => (errors = { ...errors, [err.path]: err.msg }));
  return res.status(400).json({
    errors,
  });
};

export default validate;
