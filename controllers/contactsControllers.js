import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const favorite = req.query.favorite;
    if (favorite === "") {
      throw HttpError(404, "Not found");
    }
    const { page, limit } = req.query;
    if (page === "" || limit === "") {
      throw HttpError(404, "Not found");
    }
    const user = req.user;
    const contacts = await contactsService.listContacts({
      user,
      favorite,
      page,
      limit,
    });
    res.send(contacts);
  } catch (e) {
    next(e);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(
      req.params.id,
      req.user
    );
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.send(contact);
  } catch (e) {
    next(e);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await contactsService.removeContact(
      req.params.id,
      req.user
    );
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.send(contact);
  } catch (e) {
    next(e);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await contactsService.addContact(req.body, req.user);
    res.status(201).send(newContact);
  } catch (e) {
    next(e);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const updatedContact = await contactsService.updateContact(
      req.params.id,
      req.body,
      req.user
    );
    if (!updatedContact) {
      throw HttpError(404, "Not found");
    }
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }
    res.send(updatedContact);
  } catch (e) {
    next(e);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const updatedStatus = await contactsService.updateStatusContact(
      req.params.id,
      req.body,
      req.user
    );
    if (!updatedStatus) {
      throw HttpError(404, "Not found");
    }
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }
    res.send(updatedStatus);
  } catch (e) {
    next(e);
  }
};
