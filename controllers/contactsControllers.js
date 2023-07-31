import Contact from "../models/contact.js";
import { HttpError } from "../helpers/index.js";
import { controllerWrapper } from "../decorators/index.js";

const listContacts = async (req, res) => {
	const { _id: owner } = req.user;

	const { page = 1, limit = 20, ...favorite } = req.query;
	const skip = (page - 1) * limit;

	const result = await Contact.find({ owner, ...favorite }, "-createdAt -updatedAt", { skip, limit }).populate(
		"owner",
		"email subscription",
	);
	res.json(result);
};

const getContactById = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findById(id);
	if (!result) {
		throw HttpError(404);
	}
	res.json(result);
};

const addContact = async (req, res) => {
	const { _id: owner } = req.user;
	const result = await Contact.create({ ...req.body, owner });
	res.status(201).json(result);
};

const deleteContactById = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findByIdAndDelete(id);
	if (!result) {
		throw HttpError(404);
	}
	res.json({ message: "contact deleted" });
};

const updateContactById = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
	if (!result) {
		throw HttpError(404);
	}
	res.json(result);
};

const updateFavoriteById = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
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
	updateFavoriteById: controllerWrapper(updateFavoriteById),
};
