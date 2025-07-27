import { validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors from express-validator.
 * If validation errors exist, it sends a 400 response. Otherwise, it calls the next middleware.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Use the custom error response format
    return res.error(
      errors.array().map(e => e.msg).join(', '), 
      400
    );
  }
  next();
};

export default handleValidationErrors;
