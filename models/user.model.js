import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    department: {
      type: String,
      enum: ["SDE", "QA", "DA", "HR", "CS", "EMP"],
      default: "EMP",
    },
  },

  { timestamps: true },
);

const User = mongoose.model("user", userSchema);

export default User;
