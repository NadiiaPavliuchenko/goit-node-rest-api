import { contacts } from "../models/contacts.js";

async function listContacts({ user, favorite, page, limit }) {
  const owner = user.id;
  if (favorite) {
    return await contacts.find({ owner, favorite });
  }
  const skip = (page - 1) * limit || 0;
  return await contacts.find({ owner }).skip(skip).limit(limit);
}

async function getContactById(contactId, owner) {
  const contact = await contacts.findOne({ owner: owner.id, _id: contactId });
  if (!contact || contact.length === 0) {
    return null;
  }

  return contact;
}

async function removeContact(contactId, owner) {
  const deletedContact = await contacts.findOneAndDelete({
    _id: contactId,
    owner: owner.id,
  });
  if (deletedContact === null) {
    return null;
  }
  return deletedContact;
}

async function addContact({ name, email, phone, favorite }, owner) {
  const newContact = await contacts.create({
    name,
    email,
    phone,
    favorite,
    owner: owner.id,
  });

  return newContact;
}

async function updateContact(
  contactId,
  { id, name, email, phone, favorite },
  owner
) {
  console.log(owner.id);
  const newContact = {
    id,
    name,
    email,
    phone,
    favorite,
  };
  const updatedContact = await contacts.findOneAndUpdate(
    { _id: contactId, owner: owner.id },
    newContact,
    {
      new: true,
    }
  );
  if (updatedContact !== null) {
    return updatedContact;
  } else {
    return null;
  }
}

async function updateStatusContact(contactId, { favorite }, owner) {
  const newContact = {
    favorite,
  };

  const updatedContact = await contacts.findOneAndUpdate(
    { _id: contactId, owner: owner.id },
    newContact,
    {
      new: true,
    }
  );
  if (updatedContact !== null) {
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
