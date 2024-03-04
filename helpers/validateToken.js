import jwt from "jsonwebtoken";
import { User } from "../models/users.js";

const validateToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (typeof authorizationHeader === "undefined") {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const [bearer, token] = authorizationHeader.split(" ", 2);
  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    const user = await User.findById(decode.id);
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    if (token !== user.token) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    req.user = {
      id: decode.id,
      email: decode.email,
    };
    next();
  });
};

export default validateToken;
