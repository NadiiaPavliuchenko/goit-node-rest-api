import usersService from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";

export const registerUser = async (req, res, next) => {
  try {
    const newUser = await usersService.registerUser(req.body);
    if (newUser === null) {
      throw HttpError(409, "Email in use");
    }
    res.status(201).send(newUser);
  } catch (e) {
    next(e);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const login = await usersService.loginUser(req.body);
    if (login === null) {
      throw HttpError(401, "Email or password is wrong");
    }
    res.send(login);
  } catch (e) {
    next(e);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const logout = await usersService.logoutUser(req.user);
    if (logout === null) {
      throw HttpError(401, "Unauthorized");
    }
    res.status(204).send("No content");
  } catch (e) {
    next(e);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await usersService.getCurrentUser(
      req.headers.authorization
    );
    if (!currentUser) {
      throw HttpError(401, "Unauthorized");
    }
    res.send(currentUser);
  } catch (e) {
    next(e);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const updatedSubscription = await usersService.updateSubscription(
      req.user,
      req.body
    );
    if (!updatedSubscription) {
      throw HttpError(404, "Not found");
    }
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }
    res.send(updatedSubscription);
  } catch (e) {
    next(e);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "File was not selected");
    }
    const newAvatar = await usersService.updateAvatar(req.user, req.file);
    if (newAvatar === null) {
      throw HttpError(401, "Unauthorized");
    }
    res.send(newAvatar);
  } catch (e) {
    next(e);
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const verifiedUser = await usersService.verifyUser(
      req.params.verificationToken
    );
    if (verifiedUser === null) {
      throw HttpError(404, "Not found");
    }
    res.send(verifiedUser);
  } catch (e) {
    next(e);
  }
};

export const resendEmail = async (req, res, next) => {
  try {
    const newLink = await usersService.resendEmail(req.body.email);
    if (newLink === null) {
      res.status(400).json({ message: "Verification has already been passed" });
    }
    res.send(newLink);
  } catch (e) {
    next(e);
  }
};
