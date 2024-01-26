import express from "express";
import * as AuthController from "../controllers/user.js";
import { verifyAuth, Roles } from "../middleware/authVerify.js";
import {
  loginLimiter,
  registerLimiter,
  verifyLimiter,
} from "../middleware/rateLimit.js";

const router = express.Router();

//user
router.post("/signup", registerLimiter, AuthController.signUp);
router.post("/login", loginLimiter, AuthController.login);

//verify user account
router.patch("/verify-account/:id/:token", AuthController.verifyAccount);
router.post(
  "/resend-token/:id",
  verifyLimiter,
  verifyAuth(Roles.All),
  AuthController.sendVerificationLink
);

//password reset and recovery
router.post("/verify-email", AuthController.recoverPasswordLink);
router.patch("/reset-password/:id/:token", AuthController.resetUserPassword);

//middleware routes
router.patch("/update", verifyAuth(Roles.All), AuthController.updateUserdata);

//authicate to sign in user
router.get("/", verifyAuth(Roles.All), AuthController.authenticateUser);

//get user details
router.get(
  "/profile/:userName",
  verifyAuth(Roles.All),
  AuthController.getProfileUser
);

//get user subscribed to, follow and unfollow
router.get(
  "/:id/subbedusers",
  verifyAuth(Roles.All),
  AuthController.getSubcribedUsers
);
router.put("/sub/:id", verifyAuth(Roles.All), AuthController.subAUser);
router.put("/unsub/:id", verifyAuth(Roles.All), AuthController.unSubAUser);

export default router;
