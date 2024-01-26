import { rateLimit } from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
});

export const verifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 5 minutes
  max: 5,
});

export const registerLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5,
});

export const homePageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hr
  max: 100,
});

export default {
  loginLimiter,
  registerLimiter,
  homePageLimiter,
  verifyLimiter,
};
