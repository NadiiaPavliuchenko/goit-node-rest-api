import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

const contactsPath = path.resolve("./db/contacts.json");

async function listContacts() {
  const contacts = await fs.readFile(contactsPath);

  return JSON.parse(contacts);
}

async function getContactById(contactId) {
  const contacts = await listContacts();

  const contact = contacts.find((elem) => elem.id === contactId);
  if (contact) {
    return contact;
  } else {
    return null;
  }
}

async function removeContact(contactId) {
  const contacts = await listContacts();

  const deletedIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );
  if (deletedIndex !== -1) {
    const newContacts = contacts.filter((contact) => contact.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return contacts[deletedIndex];
  } else {
    return null;
  }
}

async function addContact({ name, email, phone }) {
  const contacts = await listContacts();

  const newContact = {
    id: uuid(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
}

async function updateContact(contactId, body) {
  const contacts = await listContacts();

  const updateIndex = contacts.findIndex((contact) => contact.id === contactId);
  if (updateIndex !== -1) {
    const updatedContact = {
      ...contacts[updateIndex],
      ...body,
    };
    contacts.splice(updateIndex, 1, updatedContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return updatedContact;
  } else {
    return null;
  }
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
