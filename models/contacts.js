import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("models", "contacts.json");

const listContacts = async () => {
	const allContacts = await fs.readFile(contactsPath);
	return JSON.parse(allContacts);
};

const getContactById = async contactId => {
	const contacts = await listContacts();
	const contact = contacts.find(el => el.id === contactId);
	return contact || null;
};

const removeContact = async contactId => {
	const contacts = await listContacts();
	const index = contacts.findIndex(el => el.id === contactId);
	if (index === -1) {
		return null;
	}
	const [removedContact] = contacts.splice(index, 1);
	await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
	return removedContact;
};

const addContact = async ({ name, email, phone }) => {
	const contacts = await listContacts();
	const newContact = {
		id: nanoid(),
		name,
		email,
		phone,
	};
	contacts.push(newContact);
	await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
	return newContact;
};

const updateContact = async (id, { name, email, phone }) => {
	const contacts = await listContacts();
	const index = contacts.findIndex(el => el.id === id);
	if (index === -1) {
		return null;
	}
	contacts[index] = { id, name, email, phone };
	await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
	return contacts[index];
};

export default {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
};
