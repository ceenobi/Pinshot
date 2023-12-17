import express from "express";
import * as AuthController from "../controllers/user.js";
import { verifyAuth, Roles } from "../middleware/authVerify.js";

const router = express.Router();

router.post("/signup", AuthController.signUp);
router.post("/login", AuthController.login);
router.post("/verify-email", AuthController.recoverPasswordLink);

router.patch("/reset-password/:id/:token", AuthController.resetUserPassword);
router.get("/verify/:id/:token", AuthController.verifyEmail);

//middleware routes
router.patch("/update", verifyAuth(Roles.All), AuthController.updateUserdata);
router.get("/", verifyAuth(Roles.All), AuthController.authenticateUser);
router.get(
  "/profile/:userName",
  verifyAuth(Roles.All),
  AuthController.getProfileUser
);
router.get(
  "/:id/subbedusers",
  verifyAuth(Roles.All),
  AuthController.getSubcribedUsers
);
router.put("/sub/:id", verifyAuth(Roles.All), AuthController.subAUser);
router.put("/unsub/:id", verifyAuth(Roles.All), AuthController.unSubAUser);

export default router;
