import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      required: [true, "role is required"],
      enum: ["Student", "Teacher", "Parent"],
    },
    avatar: {
      type: String, //cloudinary url
      require: [true, "avatar is required"],
    },
    grade: {
      type: String,
      required: function () {
        return this.role === "Student";
      },
    },
    school: {
      type: String,
      required: function () {
        return this.role === "Student" || "Teacher";
      },
    },
    refreshToken:{
        type:String,
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
