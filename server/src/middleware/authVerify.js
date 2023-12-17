import { promisify } from "util";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import env from "../utils/validateEnv.js";

const jwtVerify = promisify(jwt.verify);

export const verifyAuth =
  (roles = []) =>
  async (req, res, next) => {
    if (!Array.isArray(roles)) roles = [roles];
    const { authorization: token } = req.headers;
    if (!token) return next(createHttpError(401, "No Token"));
    if (!token.startsWith("Bearer"))
      return next(createHttpError(401, "Token format invalid"));
    const tokenString = token.split(" ")[1];
    try {
      const decodedToken = await jwtVerify(
        tokenString,
        env.ACCESS_TOKEN_PRIVATE_KEY
      );
      if (!decodedToken.role) {
        return next(createHttpError(403, "Error: Role missing"));
      }
      if (!roles.includes(decodedToken.role))
        return next(
          createHttpError(401, "User not authorized for this request")
        );
      req.user = decodedToken;
      next();
    } catch (error) {
      return next(createHttpError(403, "Broken or expired Token, pls log in"));
    }
  };

export const Roles = {
  User: ["user"],
  Admin: ["admin"],
  All: ["user", "admin"],
};
