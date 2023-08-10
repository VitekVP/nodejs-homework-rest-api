import express from "express";

import { validateBody } from "../decorators/index.js";
import userSchema from "../schemas/userSchema.js";
import authControllers from "../controllers/authControllers.js";
import { authenticate, uploadFile } from "../middlewares/index.js";

const router = express.Router();

router.post("/register", validateBody(userSchema.userSingupSchema), authControllers.signup);

router.get("/verify/:verificationToken", authControllers.verify);

router.post("/verify", validateBody(userSchema.userEmailSchema), authControllers.resendVerify);

router.post("/login", validateBody(userSchema.userSinginSchema), authControllers.signin);

router.post("/logout", authenticate, authControllers.signout);

router.get("/current", authenticate, authControllers.getCurrent);

router.patch(
	"",
	authenticate,
	validateBody(userSchema.userUpdateSubscriptionSchema),
	authControllers.updateSubscription,
);

router.patch("/avatars", authenticate, uploadFile.single("avatar"), authControllers.updateAvatar);

export default router;
