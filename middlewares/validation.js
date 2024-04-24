import AppError from "../utils/appError.js";

const validation = (schema) => (req, res, next) => {
  try {
    const field = "body";
    const result = schema.safeParse(req[field]);
    if (!result.success) {
      console.log("validation erorr : ", result?.error?.issues[0]);
      const errorMessage = result?.error?.errors[0].message || "validation error";
      return next(new AppError(errorMessage, 400));
    }
    req.body = result?.data;
    next();
  } catch (error) {
    console.log(error);
    return next(new AppError("validation error", 400));
  }
};

export default validation;
