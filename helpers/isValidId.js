import mongoose from "mongoose";
import HttpError from "./HttpError.js";

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw HttpError(400, `${id} is not valid`);
  }
  next();
};

export default isValidId;
