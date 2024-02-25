import { contacts } from "../models/contacts.js";

async function listContacts() {
  return await contacts.find();
}

async function getContactById(contactId) {
  const contact = await contacts.findById(contactId);
  if (contact) {
    return contact;
  } else {
    return null;
  }
}

async function removeContact(contactId) {
  const deletedContact = await contacts.findByIdAndDelete(contactId);
  if (deletedContact === null) {
    return null;
  }
  return deletedContact;
}

async function addContact({ name, email, phone, favorite }) {
  const newContact = await contacts.create({ name, email, phone, favorite });

  return newContact;
}

async function updateContact(contactId, { id, name, email, phone, favorite }) {
  const newContact = {
    id,
    name,
    email,
    phone,
    favorite,
  };
  const updatedContact = await contacts.findByIdAndUpdate(
    contactId,
    newContact,
    {
      new: true,
    }
  );
  if (updateContact !== null) {
    return updatedContact;
  } else {
    return null;
  }
}

async function updateStatusContact(contactId, { favorite }) {
  const newContact = {
    favorite,
  };
  const updatedContact = await contacts.findByIdAndUpdate(
    contactId,
    newContact,
    {
      new: true,
    }
  );
  if (updateContact !== null) {
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
  updateStatusContact,
};
