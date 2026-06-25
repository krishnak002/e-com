import mongoose from "mongoose";

const db = async () => {
  try {
    await mongoose.connect('mongodb+srv://krishnakanjani2_db_user:12345@cluster0.23m1flr.mongodb.net');
    console.log("database connected");
  } catch (err) {
    console.log("DB Error:", err.message);
  }
};

export default db;