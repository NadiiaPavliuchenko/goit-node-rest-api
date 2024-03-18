import bcrypt from "bcryptjs";
import { User } from "../models/users.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import * as Path from "node:path";
import fs from "fs";
import nodemailer from "nodemailer";
import { v4 as uuid } from "uuid";
import HttpError from "../helpers/HttpError.js";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

const saltRounds = 10;

async function registerUser({ password, email, subscription }) {
  const user = await User.findOne({ email });
  if (user) {
    return null;
  }
  const hashPassword = await bcrypt.hash(password, saltRounds);
  const avatarURL = gravatar.url(email);
  const verificationToken = uuid();

  await transporter.sendMail({
    from: "n.pavljuchenko@gmail.com",
    to: email,
    subject: "Welcome to phonebook app",
    text: `To confirm you registration please click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
    html: `To confirm you registration please click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
  });

  const newUser = await User.create({
    password: hashPassword,
    email,
    verificationToken,
    subscription,
    avatarURL,
  });
  return {
    user: { email: newUser.email, subscription: newUser.subscription },
  };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return null;
  }
  if (user.verify === false) {
    throw HttpError(401, "Your account is not verified");
  }
  const payload = { id: user._id, email, password };
  const secret = process.env.SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  await User.findByIdAndUpdate(user._id, { token });
  return {
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  };
}

async function logoutUser({ id }) {
  const user = await User.findByIdAndUpdate(id, { token: null });
  if (!user) {
    return null;
  }
}

async function getCurrentUser(bearerToken) {
  const [bearer, token] = bearerToken.split(" ", 2);

  const user = await User.findOne({ token });
  console.log("user", user);
  if (token !== user.token) {
    return null;
  }
  return { email: user.email, subscription: user.subscription };
}

async function updateSubscription({ id }, { subscription }) {
  const newUser = {
    subscription,
  };
  const updatedUser = await User.findByIdAndUpdate(id, newUser, { new: true });
  if (updatedUser === null) {
    return null;
  } else {
    return updatedUser;
  }
}

async function updateAvatar({ id }, { path }) {
  const avatar = await Jimp.read(path);
  await avatar.resize(250, 250);
  const avatarFilename = Date.now() + Path.extname(path);
  await avatar.writeAsync(`public/avatars/${avatarFilename}`);
  fs.unlink(path, function (err) {
    if (err) return console.log(err);
    console.log("file deleted successfully");
  });
  const normalizedAvatar = `/avatars/${avatarFilename}`;

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      avatarURL: normalizedAvatar,
    },
    { new: true }
  );
  return updatedUser ? { avatarURL: updatedUser.avatarURL } : null;
}

async function verifyUser(verificationToken) {
  const userToVerify = await User.findOne({ verificationToken });
  if (userToVerify === null) {
    return null;
  }
  await userToVerify.updateOne({ verificationToken: null, verify: true });
  return {
    message: "Verification successful",
  };
}

async function resendEmail(email) {
  const user = await User.findOne({ email });
  if (user.verify === true) {
    return null;
  }
  const verificationToken = user.verificationToken;
  await transporter.sendMail({
    from: "n.pavljuchenko@gmail.com",
    to: email,
    subject: "Welcome to phonebook app",
    text: `To confirm you registration please click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
    html: `To confirm you registration please click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
  });
  return {
    message: "Verification email sent",
  };
}

export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
  verifyUser,
  resendEmail,
};
