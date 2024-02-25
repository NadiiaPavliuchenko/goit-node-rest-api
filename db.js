import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;
console.log(DB_URI);

mongoose
  .connect(DB_URI)
  .then(() => console.log("Database connection successful"))
  .catch((e) => {
    console.log("Database connection error", e);
    process.exit(1);
  });
