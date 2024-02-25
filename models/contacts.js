import mongoose from "mongoose";

const contactsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      match: /(\d{10}|\(\d{3}\) \d{3}-\d{4})/,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

export const contacts = mongoose.model("contacts", contactsSchema);
