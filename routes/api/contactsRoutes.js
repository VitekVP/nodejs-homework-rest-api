import express from "express";

import { contactsControllers } from "../../controllers/index.js";
import { validateBody } from "../../decorators/index.js";
import contactsSchema from "../../schemas/contactSchema.js";
import { isEmptyBody, isValidId, isEmptyFavorite } from "../../middlewares/index.js";

const router = express.Router();

router.get("/", contactsControllers.listContacts);

router.get("/:id", isValidId, contactsControllers.getContactById);

router.post("/", isEmptyBody, validateBody(contactsSchema.contactsAddSchema), contactsControllers.addContact);

router.delete("/:id", isValidId, contactsControllers.deleteContactById);

router.put(
	"/:id",
	isValidId,
	isEmptyBody,
	validateBody(contactsSchema.contactsAddSchema),
	contactsControllers.updateContactById,
);

router.patch(
	"/:id/favorite",
	isValidId,
	isEmptyFavorite,
	validateBody(contactsSchema.contactUpdateFavoriteSchema),
	contactsControllers.updateFavoriteById,
);

export default router;
