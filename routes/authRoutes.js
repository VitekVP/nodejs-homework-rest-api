import express from "express";

import { validateBody } from "../decorators/index.js";
import userSchema from "../schemas/userSchema.js";
import authControllers from "../controllers/authControllers.js";
import { authenticate } from "../middlewares/index.js";

const router = express.Router();

router.post("/register", validateBody(userSchema.userSingupSchema), authControllers.signup);

router.post("/login", validateBody(userSchema.userSinginSchema), authControllers.signin);

router.post("/logout", authenticate, authControllers.signout);

router.get("/current", authenticate, authControllers.getCurrent);

router.patch(
	"",
	authenticate,
	validateBody(userSchema.userUpdateSubscriptionSchema),
	authControllers.updateSubscription,
);

export default router;
