import contactsServise from "../models/contacts.js";
import { HttpError } from "../helpers/index.js";
import { controllerWrapper } from "../decorators/index.js";

const listContacts = async (req, res) => {
	const result = await contactsServise.listContacts();
	res.json(result);
};

const getContactById = async (req, res) => {
	const { contactId } = req.params;
	const result = await contactsServise.getContactById(contactId);
	if (!result) {
		throw HttpError(404);
	}
	res.json(result);
};

const addContact = async (req, res) => {
	const result = await contactsServise.addContact(req.body);
	res.status(201).json(result);
};

const deleteContactById = async (req, res) => {
	const { contactId } = req.params;
	const result = await contactsServise.removeContact(contactId);
	if (!result) {
		throw HttpError(404);
	}
	res.json({ message: "contact deleted" });
};

const updateContactById = async (req, res) => {
	const { contactId } = req.params;
	const result = await contactsServise.updateContact(contactId, req.body);
	if (!result) {
		throw HttpError(404);
	}
	res.json(result);
};

export default {
	listContacts: controllerWrapper(listContacts),
	getContactById: controllerWrapper(getContactById),
	addContact: controllerWrapper(addContact),
	deleteContactById: controllerWrapper(deleteContactById),
	updateContactById: controllerWrapper(updateContactById),
};
