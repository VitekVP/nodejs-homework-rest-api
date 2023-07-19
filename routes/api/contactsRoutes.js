import express from "express";

import { contactsControllers } from "../../controllers/index.js";
import { validateBody } from "../../decorators/index.js";
import contactsSchema from "../../schemas/contactSchema.js";
import { isEmptyBody } from "../../middlewares/index.js";

const router = express.Router();

router.get("/", contactsControllers.listContacts);

router.get("/:contactId", contactsControllers.getContactById);

router.post("/", isEmptyBody, validateBody(contactsSchema.contactsAddSchema), contactsControllers.addContact);

router.delete("/:contactId", contactsControllers.deleteContactById);

router.put(
	"/:contactId",
	isEmptyBody,
	validateBody(contactsSchema.contactsAddSchema),
	contactsControllers.updateContactById,
);

export default router;
