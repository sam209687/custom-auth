// is line humne schema and document bi le liya hai
import mongoose, { Schema, Document } from "mongoose";

export interface Products extends Document {
  content: string;
  created_at: Date;
}

const ProductsSchema: Schema<Products> = new Schema({
  content: {
    type: String,
    required: true,
  },

  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  isVerified: boolean;
  verifyCodeExpiry: Date;
  products: Products[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username required"],
    trim: true,
    unique: true,
  },

  email: {
    type: String,
    required: [true, "Email required"],
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, "Provide vaild emaill address"],
  },

  password: {
    type: String,
    required: [true, "Password required"],
  },

  verifyCode: {
    type: String,
    required: [true, "Verification code required"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  verifyCodeExpiry: {
    type: Date,
    required: [true, "Your code got expired required"],
  },

  products: [ProductsSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);


  export default UserModel;
